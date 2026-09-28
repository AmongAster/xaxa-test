import {IsInt,IsNotEmpty,IsOptional,IsString,MaxLength,Min,} from 'class-validator';

export class CreateWorkflowInstanceDto {
  @IsInt()
  @Min(1)
  templateId!: number;

  @IsInt()
  @Min(1)
  universityId!: number;

  @IsInt()
  @Min(1)
  productId!: number;
}

export class TransitionWorkflowDto {
  @IsInt()
  @Min(0)
  targetStepIndex!: number;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(2000)
  comment?: string;
}