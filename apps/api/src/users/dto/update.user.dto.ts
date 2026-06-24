import { CreateUserDto } from './create.user.dto';
import { IsOptional, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: 'profile.jpg',
    description: 'Photo URL of the user',
  })
  @IsOptional()
  @IsString({ message: 'PhotoUrl must be a string' })
  readonly photoUrl?: string;

  @ApiProperty({
    example: 'refresh-token-1234567890',
    description: 'Refresh token of the user',
  })
  @IsOptional()
  @IsString()
  readonly refreshToken?: string;

  @ApiProperty({
    example: 'NewStrongP@ssw0rd',
    description: 'New password for the user',
  })
  @IsOptional()
  @IsStrongPassword()
  readonly newPassword?: string;
}
