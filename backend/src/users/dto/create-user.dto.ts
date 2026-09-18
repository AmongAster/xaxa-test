import { IsEmail, IsString, MaxLength, MinLength,} from "class-validator";


export class CreateUserDto{
    @IsEmail({}, {message: 'Некорректный email формат'})
    email!: string;

    @IsString()@MinLength(6, {message: "Пароль должен быть больше 6"})
    @MaxLength(50, {message: "Пароль должен быть меньше 50"})
    password!: string;

    @IsString()@MinLength(1, {message: "Имя не может быть меньше 1"})
    @MaxLength(50, {message: "Имя не может быть меньше 50"})
    name!: string;
}