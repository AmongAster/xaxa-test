import {Column, DataType, Model, Table } from "sequelize-typescript";
 

export interface UserCreationAttrs {
  email: string;
  password: string;
  name: string}

  @Table({ 
    tableName: 'users',
     timestamps: true,
    })
export class Users extends Model {

  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: number;

  @Column( {type: DataType.STRING, allowNull: false, unique: true, validate: { isEmail: true }})
  email!: string;
    
  @Column( {type: DataType.STRING, allowNull: false })
  password!: string;
    
  @Column( {type: DataType.STRING, allowNull: false })
  name!: string;}
