import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Role } from '../roles/role.model';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User> {
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare keycloakId: string; // <-- Заменено с keycloakId!: string

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare fullName: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare phone: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare roleId: number;

  @BelongsTo(() => Role)
  declare role: Role; // Для ассоциаций (!) оставляем как есть

  // Самоссылка для иерархии "руководитель -> подчинённые"
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  declare managerUserId: number;

  @BelongsTo(() => User, 'managerUserId')
  declare managerUser: User;

  @HasMany(() => User, 'managerUserId')
  declare subordinates: User[];

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare isActive: boolean;
}
