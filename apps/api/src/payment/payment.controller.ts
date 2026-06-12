import { Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post('simulation/:orderId')
    @UseGuards(AuthTokenGuard)
    async simulation(@Param('orderId') orderId: string, @CurrentUser() user: any) {
        return this.paymentService.simulation(orderId, user.sub);
    }

    @Patch('confirmation/:token')
    async confirmation(@Param('token') token: string) {
        return this.paymentService.confirmation(token);
    }
}
