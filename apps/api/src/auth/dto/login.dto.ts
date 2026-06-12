import { IsEmail, IsStrongPassword } from "class-validator"

export default class LoginDto {
    @IsEmail()
    readonly email: string

    @IsStrongPassword()
    readonly password: string
}