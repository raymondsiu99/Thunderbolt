import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Job } from './job.model';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';

@Module({
    imports: [SequelizeModule.forFeature([Job])],
    providers: [JobsService],
    controllers: [JobsController],
})
export class JobsModule { }
