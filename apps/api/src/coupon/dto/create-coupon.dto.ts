import { CouponType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';

export class CreateCouponDto {
  @ApiProperty({
    example: 'X212',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    enum: CouponType,
    example: CouponType.PERCENTAGE,
  })
  @IsEnum(CouponType)
  @IsNotEmpty()
  type: CouponType;

  @ApiProperty({
    type: 'number',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @ApiProperty({
    type: 'number',
    example: 100,
  })
  @IsNumber()
  @IsOptional()
  maxUses?: number;

  @ApiProperty({
    type: 'boolean',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @ApiProperty({
    example: '2025-01-01T00:00:00Z',
  })
  @IsDate()
  @IsOptional()
  expiresAt?: Date;
}