import { IsEnum } from "class-validator";
import { CreateOrderDto } from "./create-order.dto";
import { OrderStatus } from "@prisma/client";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    @IsEnum(OrderStatus)
    readonly status?: OrderStatus
}