import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from '@prisma/client';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Post()
    async checkout(@CurrentUser() userId: string, @Body() dto: CreateOrderDto) {
        return this.ordersService.checkout(userId, dto)
    }

    @Get()
    async findAll(@CurrentUser() userId: string) {
        return this.ordersService.findAllByUser(userId)
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @CurrentUser() userId: string) {
        return this.ordersService.findOne(id, userId)
    }

    @Patch(':id/status')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    async update(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
        return this.ordersService.updateStatus(id, dto)
    }
}
