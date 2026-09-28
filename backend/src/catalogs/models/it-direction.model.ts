import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { ITProduct } from './it-product.model';

@Table({ tableName: 'it_directions', timestamps: true })
export class ITDirection extends Model<ITDirection> {
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name!: string; 

  @HasMany(() => ITProduct)
  products!: ITProduct[];
}