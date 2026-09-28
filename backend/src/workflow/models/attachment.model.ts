import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from 'sequelize-typescript';
import { WorkflowStepHistory } from './workflow-step-history.model';

interface AttachmentAttributes {
  id: number;
  stepHistoryId: number;
  filename: string;
  path: string;
  mimeType: string;
  size: number;
  createdAt?: Date;
}

interface AttachmentCreationAttributes
  extends Omit<AttachmentAttributes, 'id'> {}

@Table({
  tableName: 'attachments',
  timestamps: true,
  updatedAt: false,
})
export class Attachment extends Model<
  AttachmentAttributes,
  AttachmentCreationAttributes
> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => WorkflowStepHistory)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare stepHistoryId: number;

  @BelongsTo(() => WorkflowStepHistory)
  stepHistory!: WorkflowStepHistory;

  @Column({
    field: 'fileName',
    type: DataType.STRING,
    allowNull: false,
  })
  declare filename: string;

  @Column({
    field: 'fileUrl',
    type: DataType.STRING,
    allowNull: false,
  })
  declare path: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare mimeType: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare size: number;
}