import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsEmail({}, { message: 'Некорректный email формат' })
    @IsOptional()
    email!: string;

    @IsString()
    @MinLength(2, {message: 'Имя должно быть больше 2 символов'})
    @MaxLength(50, {message: 'Имя не бывает больше 50 символов'})
    name!: string;}