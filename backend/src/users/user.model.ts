import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';

@Table({ tableName: 'Users', schema: 'tbs' })
export class User extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @Column({ unique: true, allowNull: false })
    username: string;

    @Column({ allowNull: false })
    password_hash: string;

    @Column({ allowNull: false, type: DataType.ENUM('admin', 'dispatcher', 'driver', 'customer') })
    role: string;

    @Column({ unique: true, allowNull: false })
    email: string;
}
