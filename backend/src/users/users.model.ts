import {BelongsTo,Column,DataType,ForeignKey,HasMany,Model,Table,} from 'sequelize-typescript';
import { Role } from '../roles/role.model';


@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User> {
@Column({ type: DataType.STRING, allowNull: false, unique: true })
keycloakId!: string;

@Column({ type: DataType.STRING, allowNull: false, unique: true })
email!: string;

@Column({ type: DataType.STRING, allowNull: false })
fullName!: string;

@Column({ type: DataType.STRING, allowNull: true })
phone!: string;

@ForeignKey(() => Role)
@Column({ type: DataType.INTEGER, allowNull: false })
roleId!: number;

@BelongsTo(() => Role)
role!: Role;

// Самоссылка для иерархии "руководитель -> подчинённые" (видимость ВУЗов)
@ForeignKey(() => User)
@Column({ type: DataType.INTEGER, allowNull: true })
managerUserId!: number;

@BelongsTo(() => User, 'managerUserId')
managerUser!: User;

@HasMany(() => User, 'managerUserId')
subordinates!: User[];

@Column({ type: DataType.BOOLEAN, defaultValue: true })
isActive!: boolean;
}