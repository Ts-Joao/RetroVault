import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,
  IsString
} from "class-validator";

export class ValidateCouponDto {
  @ApiProperty({ description: 'Coupon code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Order total' })
  @IsNumber()
  @IsNotEmpty()
  orderTotal: number;
}