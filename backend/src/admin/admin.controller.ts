import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    // Dashboard Stats
    @UseGuards(AuthGuard('jwt'))
    @Get('stats')
    async getDashboardStats() {
        return this.adminService.getDashboardStats();
    }

    // Activity Logs
    @UseGuards(AuthGuard('jwt'))
    @Get('activity')
    async getActivityLogs(@Query('limit') limit?: number) {
        return this.adminService.getActivityLogs(limit || 10);
    }

    // User Management
    @UseGuards(AuthGuard('jwt'))
    @Get('users')
    async getAllUsers(@Query('role') role?: string) {
        return this.adminService.getAllUsers(role);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('users/:id')
    async getUser(@Param('id') id: string) {
        return this.adminService.getUser(+id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('users')
    async createUser(@Body() userData: any) {
        return this.adminService.createUser(userData);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('users/:id')
    async updateUser(@Param('id') id: string, @Body() userData: any) {
        return this.adminService.updateUser(+id, userData);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('users/:id')
    async deleteUser(@Param('id') id: string) {
        return this.adminService.deleteUser(+id);
    }

    // Reports
    @UseGuards(AuthGuard('jwt'))
    @Get('reports/jobs')
    async getJobsReport(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
        return this.adminService.getJobsReport(startDate, endDate);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('reports/drivers')
    async getDriversReport() {
        return this.adminService.getDriversReport();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('reports/revenue')
    async getRevenueReport(@Query('period') period?: string) {
        return this.adminService.getRevenueReport(period || 'month');
    }

    // Log Activity
    @UseGuards(AuthGuard('jwt'))
    @Post('activity')
    async logActivity(@Body() activityData: { action: string; user_id: number; details?: string }) {
        return this.adminService.logActivity(activityData);
    }
}
