import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [DatabaseModule, ProductsModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
