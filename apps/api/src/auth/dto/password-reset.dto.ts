import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class RequestPasswordResetDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'E-mail do usuário',
    type: String
  })
  @IsEmail({}, { message: 'E-mail inválido.' })
  email: string;
}

export class VerifyResetCodeDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'E-mail do usuário',
    type: String,
  })
  @IsEmail({}, { message: 'E-mail inválido.' })
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Código de reset',
    type: String,
  })
  @IsString()
  @Length(6, 6, { message: 'O código deve ter 6 dígitos.' })
  code: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    example: '123456',
    description: 'Token de reset',
    type: String,
  })
  @IsString()
  resetToken: string;

  @ApiProperty({
    example: 'new_password',
    description: 'Nova senha',
    type: String,
  })
  @IsString()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  password: string;

  @ApiProperty({
    example: 'new_password',
    description: 'Confirmação da nova senha',
    type: String,
  })
  @IsString()
  confirmPassword: string;
}