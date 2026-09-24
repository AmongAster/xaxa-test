import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { WorkflowStepHistory } from './workflow-step-history.model';
import { Optional } from 'sequelize';

interface AttachmentAttributes {
  id: number;
  stepHistoryId: number;
  filename: string;
  path: string;
  mimeType: string;
  size: number;
}

interface AttachmentCreationAttributes extends Optional<AttachmentAttributes, 'id'> {}

@Table({ tableName: 'attachments', timestamps: true })
export class Attachment extends Model<AttachmentAttributes, AttachmentCreationAttributes> {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  declare id: number;

  @ForeignKey(() => WorkflowStepHistory)
  @Column({ type: DataType.INTEGER, allowNull: false })
  stepHistoryId!: number;

  @BelongsTo(() => WorkflowStepHistory)
  stepHistory!: WorkflowStepHistory;

  @Column({ type: DataType.STRING, allowNull: false })
  filename!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  path!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  mimeType!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  size!: number;
}