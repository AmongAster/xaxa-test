import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateITDirectionDto {
  @ApiProperty({ example: 'DevOps' })
  @IsString()
  name!: string;
}

export class UpdateITDirectionDto extends PartialType(CreateITDirectionDto) {}