import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
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
}