import { Column, Model, Table, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table({ tableName: 'Audits', schema: 'tbs', timestamps: false })
export class Audit extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @Column({ allowNull: false })
    action: string;

    @ForeignKey(() => User)
    @Column
    user_id: number;

    @BelongsTo(() => User, 'user_id')
    user: User;

    @Column({ defaultValue: DataType.NOW })
    timestamp: Date;

    @Column({ type: DataType.TEXT })
    details: string;
}
