import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    async checkout(@CurrentUser() user: any, @Body() dto: CreateOrderDto) {
        return this.ordersService.checkout(user.sub, dto)
    }

    @Get()
    async findAll() {
        return this.ordersService.findAll()
    }

    @Get('/user/:userId')
    async findAllByUserId(@Param('userId') userId: string) {
        return this.ordersService.findAllByUserId(userId)
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @CurrentUser() user: any) {
        return this.ordersService.findOne(user.sub, id)
    }

    @Patch(':id')
    async changePaymentStatus(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
        return this.ordersService.updatePaymentStatus(id, dto)
    }

    @Patch(':id/status')
    async update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: UpdateOrderDto) {
        return this.ordersService.updateStatus(user, id, dto)
    }
}
