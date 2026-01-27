import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Asset } from './asset.model';

@Injectable()
export class AssetsService {
    constructor(
        @InjectModel(Asset)
        private assetModel: typeof Asset,
    ) { }

    async findAll(): Promise<Asset[]> {
        return this.assetModel.findAll();
    }

    async create(asset: Partial<Asset>): Promise<Asset> {
        return this.assetModel.create(asset);
    }
}
