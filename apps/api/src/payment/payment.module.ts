import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { DatabaseModule } from 'src/database/database.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [DatabaseModule, OrdersModule],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
