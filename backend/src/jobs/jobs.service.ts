import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Job } from './job.model';

@Injectable()
export class JobsService {
    constructor(
        @InjectModel(Job)
        private jobModel: typeof Job,
    ) { }

    async findAll(): Promise<Job[]> {
        return this.jobModel.findAll();
    }

    async findOne(id: number): Promise<Job> {
        return this.jobModel.findByPk(id);
    }

    async create(job: Partial<Job>): Promise<Job> {
        return this.jobModel.create(job);
    }

    async update(id: number, job: Partial<Job>): Promise<[number, Job[]]> {
        return this.jobModel.update(job, { where: { id }, returning: true });
    }

    async remove(id: number): Promise<void> {
        const job = await this.findOne(id);
        if (job) await job.destroy();
    }
}
