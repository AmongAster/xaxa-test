import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { WorkflowInstance } from './workflow-instance.model';
import { Optional } from 'sequelize';

interface AttachmentCreationAttributes extends Optional<AttachmentAttributes, 'id'> {}

interface AttachmentAttributes {
  id: number;
  instanceId: number;
  filename: string;
  path: string;
}

@Table({ tableName: 'attachments' })
export class Attachment extends Model<AttachmentAttributes, AttachmentCreationAttributes> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => WorkflowInstance)
  @Column({ type: DataType.INTEGER, allowNull: false })
  instanceId!: number;

  @BelongsTo(() => WorkflowInstance)
  instance!: WorkflowInstance;

  @Column({ type: DataType.STRING, allowNull: false })
  filename!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  path!: string;
}