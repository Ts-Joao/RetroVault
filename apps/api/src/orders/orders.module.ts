import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { DatabaseModule } from 'src/database/database.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { PaymentModule } from 'src/payment/payment.module';
import { AuthModule } from 'src/auth/auth.module';
import { ProductsModule } from 'src/products/products.module';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [
    DatabaseModule,
    WalletModule,
    PaymentModule,
    AuthModule,
    ProductsModule,
    CartModule
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
