import { PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create.user.dto';
import { IsOptional, IsString } from 'class-validator';

export class updateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @IsString({ message: 'PhotoUrl must be a string' })
    readonly photoUrl?: string
}