import { IsEnum, IsOptional } from "class-validator";
import { CreateOrderDto } from "./create-order.dto";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    @IsEnum(OrderStatus)
    @IsOptional()
    readonly status?: OrderStatus

    @IsEnum(PaymentStatus)
    @IsOptional()
    readonly paymentStatus?: PaymentStatus
}