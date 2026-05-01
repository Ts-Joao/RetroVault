import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    ProductsModule,
    CartModule
  ],
  providers: [AppService],
})
export class AppModule {}