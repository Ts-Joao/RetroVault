import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, UnauthorizedException } from '@nestjs/common';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductService) {}

    @Post()
    createProduct(@Headers('user-id') sellerId: string, @Body() createProduct: CreateProductDto) {
        if (!sellerId) {
            throw new UnauthorizedException('Seller ID is required');
        }
        return this.productsService.create(createProduct, sellerId)
    }

    @Get()
    getProducts() {
        return this.productsService.get()
    }

    @Get(':id')
    getProductById(@Param('id') id: string) {
        return this.productsService.getById(id)
    }

    @Patch(':id')
    updateProduct(@Headers('user-id') sellerId: string, @Param('id') id: string, @Body() updateProduct: UpdateProductDto) {
        if (!sellerId) {
            throw new UnauthorizedException('Seller ID is required');
        }
        return this.productsService.update(id, updateProduct)
    } 

    @Delete(':id')
    deleteProduct(@Headers('user-id') sellerId: string, @Param('id') id: string) {
        if (!sellerId) {
            throw new UnauthorizedException('Seller ID is required');
        }
        return this.productsService.delete(id)
    }
}
