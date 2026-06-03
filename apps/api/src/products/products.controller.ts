import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductService) {}

  @UseGuards(AuthTokenGuard)
  @Post()
  createProduct(
    @Body() createProduct: CreateProductDto,
    @TokenPayloadParam() payload: PayloadDto,
  ) {
    return this.productsService.create(createProduct, payload.sub);
  }

  @Get()
  getProducts() {
    return this.productsService.get();
  }

  @Get(':productId')
  getProductById(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.productsService.getById(productId);
  }

  @Get('seller/:sellerId')
  getProductsBySellerId(@Param('sellerId', ParseUUIDPipe) sellerId: string) {
    return this.productsService.getActiveProductsBySellerId(sellerId);
  }

  @UseGuards(AuthTokenGuard)
  @Get('seller/all/:sellerId')
  getAllProductsBySellerId(
    @Param('sellerId', ParseUUIDPipe) sellerId: string,
    @TokenPayloadParam() payload: PayloadDto,
  ) {
    return this.productsService.getAllProductsBySellerId(sellerId, payload);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':productId')
  updateProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() updateProduct: UpdateProductDto,
    @TokenPayloadParam() payload: PayloadDto,
  ) {
    return this.productsService.update(productId, updateProduct, payload);
  }

  @UseGuards(AuthTokenGuard)
  @Patch('soft-delete/:productId')
  softDeleteProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
    @TokenPayloadParam() payload: PayloadDto,
  ) {
    return this.productsService.softDelete(productId, payload);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':productId')
  deleteProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
    @TokenPayloadParam() payload: PayloadDto,
  ) {
    return this.productsService.delete(productId, payload);
  }
}
