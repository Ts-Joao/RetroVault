import { IsEnum, IsOptional } from "class-validator";
import { CreateOrderDto } from "./create-order.dto";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { PartialType, ApiProperty } from "@nestjs/swagger";

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    @ApiProperty({
        enum: OrderStatus,
        description: 'Order status',
    })
    @IsEnum(OrderStatus)
    @IsOptional()
    readonly status?: OrderStatus

    @ApiProperty({
        enum: PaymentStatus,
        description: 'Payment status',
    })
    @IsEnum(PaymentStatus)
    @IsOptional()
    readonly paymentStatus?: PaymentStatus
}