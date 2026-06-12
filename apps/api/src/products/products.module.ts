import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProductsController } from './products.controller';
import { ProductService } from './products.service';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { CartService } from 'src/cart/cart.service';

@Module({
  imports: [DatabaseModule, AuthModule, CommonModule],
  controllers: [ProductsController],
  providers: [ProductService],
  exports: [ProductService], // <-- adiciona isso
})
export class ProductsModule {}