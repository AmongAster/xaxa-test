import {BelongsTo,Column,DataType,ForeignKey,Model,Table,} from 'sequelize-typescript';
import { ITDirection } from './it-direction.model';import { University } from './university.model';

@Table({ tableName: 'it_products', timestamps: true })
export class ITProduct extends Model<ITProduct> {
  @Column({ type: DataType.STRING, allowNull: false })
  name!: string;

  @ForeignKey(() => ITDirection)
  @Column({ type: DataType.INTEGER, allowNull: false })
  directionId!: number;

  @BelongsTo(() => ITDirection)
  direction!: ITDirection;

  @ForeignKey(() => University)
  @Column({ type: DataType.INTEGER, allowNull: false })
  universityId!: number;

  @BelongsTo(() => University)
  university!: University;
}