import {Table,Column,Model,DataType,PrimaryKey,Default, ForeignKey, BelongsTo,} from 'sequelize-typescript';
import { Role } from 'src/roles/role.model';


  @Table({
  tableName: 'users',
  })

export class User extends Model {
  
  
  @PrimaryKey@Default(DataType.UUIDV4) @Column(DataType.UUID)
  declare id: string;

  @Column({type: DataType.STRING, allowNull: false,})
  keycloakId!: string;

  @Column({type: DataType.STRING, allowNull: false,})
  name!: string;

  @Column({type: DataType.STRING, allowNull: false,})
  lastName!: string;

  @Column({type: DataType.STRING,allowNull: false,})
  email!: string;

  @Column({type: DataType.BOOLEAN,defaultValue: true,})
  isActive!: boolean;

  @ForeignKey(() => Role)@Column({type: DataType.INTEGER, allowNull: false})
  roleId!: number;

  @BelongsTo(() => Role)
  role!: Role;
}
