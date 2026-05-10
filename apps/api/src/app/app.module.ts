import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';
import { CartModule } from 'src/cart/cart.module';
import { AuthModule } from 'src/auth/auth.module';
<<<<<<< HEAD
import { UploadModule } from 'src/upload/upload.module';
=======
import { OrdersModule } from 'src/orders/orders.module';
import { WalletModule } from 'src/wallet/wallet.module';
>>>>>>> origin/develop

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
<<<<<<< HEAD
    UploadModule
=======
    OrdersModule,
    WalletModule
>>>>>>> origin/develop
  ],
  providers: [AppService],
})
export class AppModule {}