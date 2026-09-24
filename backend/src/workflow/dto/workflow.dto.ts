import { IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class CreateWorkflowInstanceDto {
  @IsNumber()
  templateId!: number;

  @IsNumber()
  universityId!: number;

  @IsNumber()
  productId!: number; // Обязательное поле для связи с IT-продуктом
}

export class TransitionWorkflowDto {
  @IsNumber()
  @Min(0)
  targetStepIndex!: number;

  @IsString()
  @IsOptional()
  comment?: string;
}