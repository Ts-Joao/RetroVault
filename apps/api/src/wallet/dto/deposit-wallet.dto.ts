import { Type } from "class-transformer";
import { IsNumber, IsPositive } from "class-validator";

export class DepositWalletDto {
    @IsPositive()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    readonly amount: number
}