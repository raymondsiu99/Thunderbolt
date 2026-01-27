import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Asset } from './asset.model';
import { AssetsService } from './assets.service';

@Module({
    imports: [SequelizeModule.forFeature([Asset])],
    providers: [AssetsService],
})
export class AssetsModule { }
