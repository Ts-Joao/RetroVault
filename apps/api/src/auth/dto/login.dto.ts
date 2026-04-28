import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator"

export default class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string

    @IsNotEmpty()
    @IsStrongPassword()
    readonly password: string
}