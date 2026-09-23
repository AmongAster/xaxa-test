import { IsString, IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateWorkflowTemplateDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsNotEmpty()
  steps!: { stepName: string; order: number }[];
}

export class StartWorkflowDto {
  @IsNumber()
  @IsNotEmpty()
  templateId!: number;
}

export class UpdateStepDto {
  @IsString()
  @IsNotEmpty()
  status!: string;

  @IsString()
  @IsOptional()
  comment?: string;
}