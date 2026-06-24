import { Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Simulate payment' })
  @ApiResponse({ status: 200, description: 'Payment simulated successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @Post('simulation/:orderId')
  @UseGuards(AuthTokenGuard)
  async simulation(
    @Param('orderId') orderId: string,
    @CurrentUser() user: any,
  ) {
    return this.paymentService.simulation(orderId, user.sub);
  }

  @ApiOperation({ summary: 'Confirm payment' })
  @ApiBody({ type: String })
  @ApiResponse({ status: 200, description: 'Payment confirmed successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @Patch('confirmation/:token')
  async confirmation(@Param('token') token: string) {
    return this.paymentService.confirmation(token);
  }
}
