import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from '../users/users.model';

export enum RoleName {
  USER = 'USER',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}

@Table({
  tableName: 'roles', 
  timestamps: true 
})
export class Role extends Model<Role> {
    
  @Column({
    type: DataType.ENUM(...Object.values(RoleName)),
    allowNull: false,
    unique: true,
  })
  declare name: RoleName; // <-- ИСПРАВЛЕНО: добавлено declare вместо !

  @Column({ type: DataType.STRING, allowNull: true })
  declare description: string; // <-- ИСПРАВЛЕНО: добавлено declare вместо !

  @HasMany(() => User)
  declare users: User[]; // <-- ИСПРАВЛЕНО: добавлено declare вместо !
}
