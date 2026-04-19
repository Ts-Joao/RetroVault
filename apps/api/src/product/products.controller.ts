import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
// import { ProductService } from
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductService) {}

    @Post()
    createProduct(@Body() createProduct: CreateProductDto) {
        return this.productsService.create(createProduct)
    }

    @Get()
    getproducts() {
        return this.productsService.get()
    }

    @Get(':id')
    getProductById(@Param('id', ParseUUIDPipe) id: string) {
        return this.productsService.getById(id)
    }

    @Patch(':id')
    updateProduct(@Param('id', ParseUUIDPipe) id: string, @Body() updateProduct: UpdateProductDto) {
        return this.productsService.update(id, updateProduct)
    } 

    @Delete(':id')
    deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
        return this.productsService.delete(id)
    }
}
