import { Column, DataType, Default, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  tableName: 'directions',
})


export class Direction extends Model{
    
    @Column(DataType.UUID)@PrimaryKey@Default(DataType.UUIDV4)
    declare id: string;

    @Column({type: DataType.STRING,allowNull: false})
    name!: string; 

    @Column({type: DataType.STRING})
    description!: string;
    
    @Column({type: DataType.BOOLEAN,defaultValue: true,})
    isActive!: boolean
}
    