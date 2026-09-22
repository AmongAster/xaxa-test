import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from 'src/users/users.model';
 

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
}

@Table({ tableName: 'audit_logs', timestamps: true, updatedAt: false })
export class AuditLog extends Model<AuditLog> {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column({ type: DataType.ENUM(...Object.values(AuditAction)), allowNull: false })
  action?: AuditAction;

  @Column({ type: DataType.STRING, allowNull: false })
  entityType!: string; //  

  @Column({ type: DataType.STRING, allowNull: true })
  entityId!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  ipAddress!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  userAgent!: string;

  @Column({ type: DataType.JSONB, allowNull: true })
  payload!: Record<string, unknown>;  
}