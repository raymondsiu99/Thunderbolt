import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Job } from '../jobs/job.model';
import { User } from '../users/user.model';
import { Audit } from './audit.model';

@Module({
    imports: [SequelizeModule.forFeature([Job, User, Audit])],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [AdminService],
})
export class AdminModule { }
