import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    UseGuards
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';

@Controller('orders')
@UseGuards(AuthTokenGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    async checkout(
        @TokenPayloadParam() tokenPayload: PayloadDto,
        @Body() dto: CreateOrderDto) {
        return this.ordersService.checkout(tokenPayload.sub, dto)
    }

    @Get()
    async findAll() {
        return this.ordersService.findAll()
    }

    @Get('/user/:userId')
    async findAllByUserId(
        @TokenPayloadParam() tokenPayload: PayloadDto,
        @Param('userId', ParseUUIDPipe) userId: string) {
        return this.ordersService.findAllByUserId(tokenPayload, userId)
    }

    @Get(':orderId/user/:userId')
    async findOne(
        @TokenPayloadParam() tokenPayload: PayloadDto,
        @Param('orderId') orderId: string,
        @Param('userId', ParseUUIDPipe) userId: string
    ) {
        return this.ordersService.findOne(tokenPayload, orderId, userId)
    }

    @Patch(':orderId/payment')
    async changePaymentStatus(
        @TokenPayloadParam() tokenPayload: PayloadDto,
        @Param('orderId') orderId: string,
        @Body() dto: UpdateOrderDto
    ) {
        return this.ordersService.updatePaymentStatus(tokenPayload, orderId, dto)
    }

    @Patch(':orderId/status')
    async update(
        @TokenPayloadParam() tokenPayload: PayloadDto,
        @Param('orderId') orderId: string,
        @Body() dto: UpdateOrderDto
    ) {
        return this.ordersService.updateStatus(tokenPayload, orderId, dto)
    }
}
