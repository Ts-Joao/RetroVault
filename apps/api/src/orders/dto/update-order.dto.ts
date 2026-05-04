import { IsEnum } from "class-validator";
import { CreateOrderDto } from "./create-order.dto";
import { OrderStatus } from "@prisma/client";

export class UpdateOrderDto extends CreateOrderDto {
    @IsEnum(OrderStatus)
    readonly status: OrderStatus
}