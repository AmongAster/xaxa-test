import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RoleName } from '../role.model';
 

export class CreateRoleDto {
 
  @IsEnum(RoleName)
  name!: RoleName;

  @IsOptional()
  @IsString()
  description?: string;
}