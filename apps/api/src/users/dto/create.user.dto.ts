import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString({ message: 'Email must be a string' })
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail()
    readonly email: string

    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name is required' })
    readonly name: string

    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(8, { message: 'Password must at least 8 characters long' })
    readonly password: string
}