import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';
import { CartModule } from 'src/cart/cart.module';
import { AuthModule } from 'src/auth/auth.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    UsersModule,
    ProductsModule,
    CartModule,
    AuthModule,
    OrdersModule
  ],
  providers: [AppService],
})
export class AppModule {}