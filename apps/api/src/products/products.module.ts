import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProductsController } from './products.controller';
import { ProductService } from './products.service';

@Module({
    imports: [DatabaseModule],
    controllers: [ProductsController],
    providers: [ProductService]
})
export class ProductsModule {}
