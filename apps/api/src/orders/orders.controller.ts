import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('orders')
@UseGuards(AuthTokenGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Checkout order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 200, description: 'Order created successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @Post()
  async checkout(
    @TokenPayloadParam() tokenPayload: PayloadDto,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.checkout(tokenPayload.sub, dto);
  }

  @ApiOperation({ summary: 'Find all orders' })
  @ApiResponse({ status: 200, description: 'Orders found successfully' })
  @ApiResponse({ status: 404, description: 'Orders not found' })
  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  @ApiOperation({ summary: 'Find all orders by user ID' })
  @ApiResponse({ status: 200, description: 'Orders found successfully' })
  @ApiResponse({ status: 404, description: 'Orders not found' })
  @Get('/user/:userId')
  async findAllByUserId(
    @TokenPayloadParam() tokenPayload: PayloadDto,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.ordersService.findAllByUserId(tokenPayload, userId);
  }

  @ApiOperation({ summary: 'Find order by order ID and user ID' })
  @ApiResponse({ status: 200, description: 'Order found successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @Get(':orderId/user/:userId')
  async findOne(
    @TokenPayloadParam() tokenPayload: PayloadDto,
    @Param('orderId') orderId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.ordersService.findOne(tokenPayload, orderId, userId);
  }

  @ApiOperation({ summary: 'Change payment status' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({
    status: 200,
    description: 'Payment status changed successfully',
  })
  @ApiResponse({ status: 404, description: 'Payment status not found' })
  @Patch(':orderId/payment')
  async changePaymentStatus(
    @TokenPayloadParam() tokenPayload: PayloadDto,
    @Param('orderId') orderId: string,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.ordersService.updatePaymentStatus(tokenPayload, orderId, dto);
  }

  @ApiOperation({ summary: 'Update order status' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({
    status: 200,
    description: 'Order status changed successfully',
  })
  @ApiResponse({ status: 404, description: 'Order status not found' })
  @Patch(':orderId/status')
  async update(
    @TokenPayloadParam() tokenPayload: PayloadDto,
    @Param('orderId') orderId: string,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.ordersService.updateStatus(tokenPayload, orderId, dto);
  }
}
