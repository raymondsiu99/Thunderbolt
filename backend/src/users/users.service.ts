import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private userModel: typeof User,
    ) { }

    async findOne(username: string): Promise<User | null> {
        return this.userModel.findOne({ where: { username } });
    }

    async create(user: Partial<User>): Promise<User> {
        return this.userModel.create(user);
    }

    async findById(id: number): Promise<User | null> {
        return this.userModel.findByPk(id);
    }
}
