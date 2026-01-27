import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({ tableName: 'Assets' })
export class Asset extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @Column({ allowNull: false })
    name: string;

    @Column({ allowNull: false, type: DataType.ENUM('dump_truck', 'water_truck', 'float', 'hydroseeder', 'sweeper') })
    type: string;

    @Column
    geotab_id: string;

    @Column({ defaultValue: true })
    availability: boolean;
}
