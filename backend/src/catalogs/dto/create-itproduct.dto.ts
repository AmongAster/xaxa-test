import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';
 
export class CreateITProductDto {
  @ApiProperty({ example: 'Kubernetes' })
  @IsString()
  name!: string;
 
  @ApiProperty({ example: 1, description: 'ID направления' })
  @IsInt()
  directionId!: number;
 
  @ApiProperty({ example: 1, description: 'ID Вуза' })
  @IsInt()
  universityId!: number;
}
 
export class UpdateITProductDto extends PartialType(CreateITProductDto) {}