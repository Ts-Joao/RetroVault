import { ApiProperty } from "@nestjs/swagger"
import {
    IsEmail,
    IsNotEmpty,
    IsStrongPassword,
    IsString
} from "class-validator"

export default class LoginDto {
    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'Email of the user',
    })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string

    @ApiProperty({
        example: 'StrongP@ssw0rd',
        description: 'Password of the user',
    })
    @IsString()
    @IsNotEmpty()
    @IsStrongPassword()
    readonly password: string
}