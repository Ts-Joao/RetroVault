import { Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post('simulation/:orderId')
    @UseGuards(AuthGuard('jwt'))
    async simulation(@Param('orderId') orderId: string, @CurrentUser() user: any) {
        return this.paymentService.simulation(orderId, user.id);
    }

    @Patch('confirmation/:token')
    async confirmation(@Param('token') token: string) {
        return this.paymentService.confirmation(token);
    }
}
