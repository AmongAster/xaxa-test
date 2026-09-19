import {BelongsTo,Column,DataType,ForeignKey,HasMany,Model,Table,} from 'sequelize-typescript';
import { ITProduct } from './it-product.model';
import { User } from 'src/users/users.model';

export enum TransferStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  ON_HOLD = 'ON_HOLD',
}

export interface UniversityContact {
  fullName: string;
  position?: string;
  email?: string;
  phone?: string;
}

@Table({ tableName: 'universities', timestamps: true })


  export class University extends Model<University> {

    
  @Column({ type: DataType.STRING, allowNull: false })
  name!: string; // Название ВУЗа

  @Column({ type: DataType.STRING, allowNull: true })
  software!: string; // ПО

  @Column({ type: DataType.STRING, allowNull: true })
  contractNumber!: string; // Номер договора

  @Column({ type: DataType.DATEONLY, allowNull: true })
  licenseSigningDate!: string; // Дата подписания

  @Column({ type: DataType.INTEGER, allowNull: true })
  licenseValidUntilYear!: number; // Срок действия (год)

  @Column({
    type: DataType.ENUM(...Object.values(TransferStatus)),
    allowNull: false,
    defaultValue: TransferStatus.PLANNED,
  })
  
  transferStatus!: TransferStatus; 

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  managerId!: number; // ФИО Менеджера (FK -> User)

  @BelongsTo(() => User)
  manager!: User;

  @Column({ type: DataType.JSONB, allowNull: true, defaultValue: [] })
  universityContacts!: UniversityContact[]; 

  @Column({ type: DataType.TEXT, allowNull: true })
  comment!: string;

  @HasMany(() => ITProduct)
  products!: ITProduct[];
}