import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from 'src/users/users.model';


export enum RoleName {
  USER = 'USER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}

@Table({
   tableName: 'roles', 
   timestamps: true })

  export class Role extends Model<Role> {
    
  @Column({
    type: DataType.ENUM(...Object.values(RoleName)),
    allowNull: false,
    unique: true,
  })
  name!: RoleName;

  @Column({ type: DataType.STRING, allowNull: true })
  description!: string;

  @HasMany(() => User)
  users!: User[];
}