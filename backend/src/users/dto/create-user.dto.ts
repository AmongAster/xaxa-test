import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'a1b2c3d4-keycloak-uuid' })
  @IsString()
  keycloakId!: string;

  @ApiProperty({ example: 'ivanov@rt.ru' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Иванов Иван Иванович' })
  @IsString()
  fullName!: string;

  @ApiProperty({ required: false, example: '+7 900 000-00-00' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 2, description: 'ID роли (Role)' })
  @IsInt()
  roleId!: number;

  @ApiProperty({ required: false, example: 5, description: 'ID руководителя (User), для иерархии видимости' })
  @IsOptional()
  @IsInt()
  managerUserId?: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}