import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Min
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: 'Rua dos Bobos, 0',
    description: 'Address of the customer',
  })
  @IsString()
  readonly address: string;

  @ApiProperty({
    enum: PaymentMethod,
    description: 'Payment method',
  })
  @IsEnum(PaymentMethod)
  readonly paymentMethod: PaymentMethod;

  @ApiProperty({
    example: 1,
    description: 'Number of installments',
  })
  @Min(1)
  @IsInt()
  @IsOptional()
  readonly installments?: number = 1;

  @ApiProperty({
    example: 'RETRO10',
    description: 'Coupon code for discount',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly couponCode?: string;
}
