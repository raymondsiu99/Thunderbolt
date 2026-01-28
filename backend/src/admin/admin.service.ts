import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Job } from '../jobs/job.model';
import { User } from '../users/user.model';
import { Audit } from './audit.model';
import { Op } from 'sequelize';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Job)
        private jobModel: typeof Job,
        @InjectModel(User)
        private userModel: typeof User,
        @InjectModel(Audit)
        private auditModel: typeof Audit,
    ) { }

    // Dashboard Statistics
    async getDashboardStats() {
        const totalJobs = await this.jobModel.count();
        const activeDrivers = await this.userModel.count({ where: { role: 'driver' } });
        
        // Get completed jobs today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const completedToday = await this.jobModel.count({
            where: {
                status: 'complete',
                updatedAt: { [Op.gte]: today }
            }
        });

        // Calculate monthly revenue (mock for now - would need pricing info)
        const currentMonth = new Date();
        currentMonth.setDate(1);
        currentMonth.setHours(0, 0, 0, 0);
        const monthlyJobs = await this.jobModel.count({
            where: {
                status: 'complete',
                updatedAt: { [Op.gte]: currentMonth }
            }
        });
        const estimatedRevenue = monthlyJobs * 500; // $500 per job average

        // Get status breakdown
        const pendingJobs = await this.jobModel.count({ where: { status: 'pending' } });
        const dispatchedJobs = await this.jobModel.count({ where: { status: 'dispatched' } });
        const inProgressJobs = await this.jobModel.count({ 
            where: { 
                status: { [Op.in]: ['en_route', 'on_site', 'loading', 'in_transit', 'dumping'] } 
            } 
        });

        return {
            totalJobs,
            activeDrivers,
            completedToday,
            monthlyRevenue: estimatedRevenue,
            jobsByStatus: {
                pending: pendingJobs,
                dispatched: dispatchedJobs,
                inProgress: inProgressJobs,
                completed: await this.jobModel.count({ where: { status: 'complete' } })
            }
        };
    }

    // Activity Logs
    async getActivityLogs(limit: number = 10) {
        return this.auditModel.findAll({
            limit,
            order: [['timestamp', 'DESC']],
            include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email', 'role'] }]
        });
    }

    async logActivity(activityData: { action: string; user_id: number; details?: string }) {
        return this.auditModel.create(activityData);
    }

    // User Management
    async getAllUsers(role?: string) {
        const where = role ? { role } : {};
        return this.userModel.findAll({
            where,
            attributes: { exclude: ['password_hash'] },
            order: [['created_at', 'DESC']]
        });
    }

    async getUser(id: number) {
        return this.userModel.findByPk(id, {
            attributes: { exclude: ['password_hash'] }
        });
    }

    async createUser(userData: any) {
        const { password, ...userInfo } = userData;
        const password_hash = await bcrypt.hash(password, 10);
        
        const user = await this.userModel.create({
            ...userInfo,
            password_hash
        });

        // Log activity
        await this.logActivity({
            action: 'User created',
            user_id: user.id,
            details: `New ${user.role} user created: ${user.username}`
        });

        // Return user without password
        const { password_hash: _, ...userWithoutPassword } = user.toJSON();
        return userWithoutPassword;
    }

    async updateUser(id: number, userData: any) {
        const user = await this.userModel.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }

        // Hash password if provided
        if (userData.password) {
            userData.password_hash = await bcrypt.hash(userData.password, 10);
            delete userData.password;
        }

        await user.update(userData);

        // Log activity
        await this.logActivity({
            action: 'User updated',
            user_id: id,
            details: `User ${user.username} was updated`
        });

        const { password_hash: _, ...userWithoutPassword } = user.toJSON();
        return userWithoutPassword;
    }

    async deleteUser(id: number) {
        const user = await this.userModel.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }

        const username = user.username;
        await user.destroy();

        // Log activity
        await this.logActivity({
            action: 'User deleted',
            user_id: id,
            details: `User ${username} was deleted`
        });

        return { message: 'User deleted successfully' };
    }

    // Reports
    async getJobsReport(startDate?: string, endDate?: string) {
        const where: any = {};
        
        if (startDate && endDate) {
            where.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        const jobs = await this.jobModel.findAll({
            where,
            include: [
                { model: User, as: 'driver', attributes: ['id', 'username', 'email'] },
                { model: User, as: 'approver', attributes: ['id', 'username', 'email'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Aggregate stats
        const statusCounts = {};
        jobs.forEach(job => {
            statusCounts[job.status] = (statusCounts[job.status] || 0) + 1;
        });

        return {
            jobs,
            summary: {
                total: jobs.length,
                byStatus: statusCounts
            }
        };
    }

    async getDriversReport() {
        const drivers = await this.userModel.findAll({
            where: { role: 'driver' },
            attributes: { exclude: ['password_hash'] }
        });

        // Get job counts for each driver
        const driversWithStats = await Promise.all(
            drivers.map(async (driver) => {
                const totalJobs = await this.jobModel.count({
                    where: { driver_id: driver.id }
                });
                const completedJobs = await this.jobModel.count({
                    where: { driver_id: driver.id, status: 'complete' }
                });
                const activeJobs = await this.jobModel.count({
                    where: { 
                        driver_id: driver.id, 
                        status: { [Op.notIn]: ['complete', 'cancelled'] }
                    }
                });

                return {
                    ...driver.toJSON(),
                    stats: {
                        totalJobs,
                        completedJobs,
                        activeJobs,
                        completionRate: totalJobs > 0 ? ((completedJobs / totalJobs) * 100).toFixed(1) : 0
                    }
                };
            })
        );

        return driversWithStats;
    }

    async getRevenueReport(period: string = 'month') {
        const now = new Date();
        let startDate: Date;

        switch (period) {
            case 'week':
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case 'month':
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case 'year':
                startDate = new Date(now.setFullYear(now.getFullYear() - 1));
                break;
            default:
                startDate = new Date(now.setMonth(now.getMonth() - 1));
        }

        const completedJobs = await this.jobModel.findAll({
            where: {
                status: 'complete',
                updatedAt: { [Op.gte]: startDate }
            },
            order: [['updatedAt', 'ASC']]
        });

        // Mock revenue calculation (would need pricing table)
        const totalRevenue = completedJobs.length * 500; // $500 per job average
        const averagePerJob = completedJobs.length > 0 ? totalRevenue / completedJobs.length : 0;

        // Group by day/week/month for chart data
        const revenueByPeriod = {};
        completedJobs.forEach(job => {
            const key = job.updatedAt.toISOString().split('T')[0]; // Daily
            revenueByPeriod[key] = (revenueByPeriod[key] || 0) + 500;
        });

        return {
            period,
            totalRevenue,
            averagePerJob,
            jobsCompleted: completedJobs.length,
            revenueByPeriod
        };
    }
}
