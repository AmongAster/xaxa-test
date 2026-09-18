import {Column, DataType, Default, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
    tableName: 'universities',
})


export class University extends Model {
    
    @Column(DataType.UUID)@PrimaryKey@Default(DataType.UUIDV4)
    declare id: string;
     
    @Column({type: DataType.STRING,allowNull: false})
    name!: string; 
   
    @Column({type: DataType.STRING,allowNull: false})
    city!: string;
    
    @Column({type: DataType.STRING})
    addres!: string

    @Column({type: DataType.BOOLEAN,defaultValue: true,})
    isActive!: boolean
}