import { Column, Model, Table, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table({ tableName: 'Jobs', schema: 'tbs' })
export class Job extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @Column({ allowNull: false, type: DataType.ENUM('pending', 'dispatched', 'en_route', 'on_site', 'loading', 'in_transit', 'dumping', 'complete', 'cancelled') })
    status: string;

    @Column({ allowNull: false })
    truck_type: string;

    @Column
    material: string;

    @Column({ type: DataType.FLOAT })
    quantity: number;

    @Column({ type: DataType.FLOAT })
    location_lat: number;

    @Column({ type: DataType.FLOAT })
    location_long: number;

    @Column
    timing_start: Date;

    @Column
    timing_end: Date;

    @Column({ type: DataType.TEXT })
    photos_json: string;

    @Column({ type: DataType.TEXT })
    signature: string;

    @Column
    ticket_pdf_url: string;

    @ForeignKey(() => User)
    @Column
    driver_id: number;

    @BelongsTo(() => User, 'driver_id')
    driver: User;

    @ForeignKey(() => User)
    @Column
    approver_id: number;

    @BelongsTo(() => User, 'approver_id')
    approver: User;
}
