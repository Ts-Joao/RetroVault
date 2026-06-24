import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProductsController } from './products.controller';
import { ProductService } from './products.service';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { ShippingModule } from 'src/shipping/shipping.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    CommonModule,
    ShippingModule
  ],
  controllers: [ProductsController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductsModule { }