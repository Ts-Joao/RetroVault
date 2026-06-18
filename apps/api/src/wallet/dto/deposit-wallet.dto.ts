import { ApiProperty } from "@nestjs/swagger";
import { PaymentMethod, TypeWalletTransaction } from "@prisma/client";
import { Type } from "class-transformer";
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsPositive
} from "class-validator";

export class DepositWalletDto {
    @ApiProperty({
        example: 100.00,
        description: 'Amount to deposit',
    })
    @IsNotEmpty()
    @IsPositive()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    readonly amount: number

    @ApiProperty({
        example: 'DEPOSIT',
        description: 'Type of transaction',
    })
    @IsNotEmpty()
    @IsEnum(TypeWalletTransaction)
    readonly type: TypeWalletTransaction

    @ApiProperty({
        example: 'PIX',
        description: 'Payment method',
    })
    @IsNotEmpty()
    @IsEnum(PaymentMethod)
    readonly paymentMethod: PaymentMethod
}