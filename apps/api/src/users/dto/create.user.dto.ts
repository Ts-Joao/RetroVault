import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'Email of the user',
    })
    @IsString({ message: 'Email must be a string' })
    @IsNotEmpty({ message: 'Email is required' })
    @IsEmail()
    readonly email: string

    @ApiProperty({
        example: 'John Doe',
        description: 'Name of the user',
    })
    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name is required' })
    readonly name: string

    @ApiProperty({
        example: 'StrongP@ssw0rd',
        description: 'Password of the user',
    })
    @IsNotEmpty({ message: 'Password is required' })
    @IsStrongPassword()
    readonly password: string
}