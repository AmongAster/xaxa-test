import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { TransferStatus } from '../models/university.model';

export class FilterUniversityDto {
  @ApiProperty({ required: false, description: 'Поиск по названию (ILIKE)' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, enum: TransferStatus })
  @IsOptional()
  @IsEnum(TransferStatus)
  transferStatus?: TransferStatus;

  @ApiProperty({ required: false, description: 'Фильтр по менеджеру (для RBAC применяется автоматически из токена)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  managerId?: number;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 20;
}