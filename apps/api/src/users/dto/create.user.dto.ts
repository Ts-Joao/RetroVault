import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email of the user',
  })
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the user',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  readonly name: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd',
    description: 'Password of the user',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword()
  readonly password: string;

  @ApiProperty({
    example: '123456789',
    description: 'Phone of the user',
  })
  @IsString({ message: 'Phone must be a string' })
  @IsNotEmpty({ message: 'Phone is required' })
  readonly phone: string;

  @ApiProperty({
    example: '12345678',
    description: 'CEP of the user',
  })
  @IsString({ message: 'CEP must be a string' })
  @IsOptional({ message: 'CEP is optional' })
  @MinLength(8, { message: 'CEP must be at least 8 characters long' })
  @MaxLength(8, { message: 'CEP must be at most 8 characters long' })
  readonly cep?: string;
}
