import { PaymentMethod } from "@prisma/client"
import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator"

export class CreateOrderDto {
    @IsString()
    readonly address: string

    @IsEnum(PaymentMethod)
    readonly paymentMethod: PaymentMethod

    @Min(1)
    @IsInt()
    @IsOptional()
    readonly installments?: number = 1
}