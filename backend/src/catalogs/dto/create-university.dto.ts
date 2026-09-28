import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsEmail, IsEnum, IsInt, IsOptional, IsString, ValidateNested } from "class-validator";
import { TransferStatus } from "../models/university.model";
import { Type } from "class-transformer";




export class UniversityContactDto {
    
    @ApiProperty({ example: 'Иванова Мария Сергеевна'})
    @IsString()
    fullName!: string;


    @ApiProperty({ example: 'Старший сотрудник'})
    @IsOptional()
    @IsString()
    posithion?: string;

    @ApiProperty({ required: false, example: 'ivanova@university.ru'})
    @IsEmail()
    email!: string;

    @ApiProperty({ required: false, example: '+7 900 000-00-00'})
    @IsOptional()
    @IsString()
    phone?: string
}

export class CreateUniversityDto {


    @ApiProperty({ example: 'Московский государственный университет'})
    @IsString()
    name!: string;

    @ApiProperty({required: false, example: 'Ростелеком'}) 
    @IsOptional()
    @IsString()
    vendor?: string;

    @ApiProperty({required: false, example: 'ИТ Школа'})
    @IsOptional()
    @IsString()
    software?: string;

    @ApiProperty({required: false, example: '3311231'})
    @IsOptional()
    @IsString()
    contractNumber?: string;

    @ApiProperty({ required: false, example: '2026-09-01' })
    @IsOptional()
    @IsDateString()
    licenseSigningDate?: string; 


    @ApiProperty({ required: false, example: 2028 })
    @IsOptional()
    licenseValidUntilYear?: number;


    @ApiProperty({ enum: TransferStatus, required: false, default: TransferStatus.PLANNED })
    @IsOptional()
    @IsEnum(TransferStatus)
    transferStatus?: TransferStatus;
 
    @ApiProperty({ example: 1, description: 'ID менеджера (User)' })
    @IsInt()
    managerId!: number;
 
    @ApiProperty({ type: [UniversityContactDto], required: false })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UniversityContactDto)
    universityContacts?: UniversityContactDto[];
 
    @ApiProperty({ required: false, example: 'comment' })
    @IsOptional()
    @IsString()
    comment?: string;
}