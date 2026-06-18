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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductService) {}

  @ApiBearerAuth()
  @ApiBody({ type: CreateProductDto })
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @UseGuards(AuthTokenGuard)
  @Post()
  createProduct(
    @Body() createProduct: CreateProductDto,
    @TokenPayloadParam() payload: PayloadDto,
  ) {
    return this.productsService.create(createProduct, payload.sub);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of products' })
  @Get()
  getProducts() {
    return this.productsService.get();
  }

  @ApiOperation({ summary: 'Get active products' })
  @ApiResponse({ status: 200, description: 'List of active products' })
  @Get('active')
  getActiveProducts() {
    return this.productsService.getActiveProducts();
  }

  @ApiOperation({ summary: 'Get all media types' })
  @ApiResponse({ status: 200, description: 'List of media types' })
  @Get('media-types')
  async getMediaTypes() {
    return this.productsService.getMediaTypes();
  }

  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product found successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @Get(':productId')
  getProductById(@Param('productId') productId: string) {
    return this.productsService.getById(productId);
  }

  @ApiOperation({ summary: 'Get active product by ID' })
  @ApiResponse({ status: 200, description: 'Product found successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @Get('active/:productId')
  getProductActiveById(@Param('productId') productId: string) {
    return this.productsService.getActiveProductById(productId);
  }

  @ApiOperation({ summary: 'Get products by seller ID' })
  @ApiResponse({ status: 200, description: 'List of products' })
  @ApiResponse({ status: 404, description: 'Seller not found' })
  @Get('seller/:sellerId')
  getProductsBySellerId(@Param('sellerId', ParseUUIDPipe) sellerId: string) {
    return this.productsService.getActiveProductsBySellerId(sellerId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all products by seller ID' })
  @ApiResponse({ status: 200, description: 'List of products' })
  @ApiResponse({ status: 404, description: 'Seller not found' })
  @UseGuards(AuthTokenGuard)
  @Get('seller/all/:sellerId')
  getAllProductsBySellerId(
    @Param('sellerId', ParseUUIDPipe) sellerId: string,
    @TokenPayloadParam() payload: PayloadDto,
  ) {
    return this.productsService.getAllProductsBySellerId(sellerId, payload);
  }

  @ApiBearerAuth()
  @ApiBody({ type: UpdateProductDto })
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @UseGuards(AuthTokenGuard)
  @Patch(':productId')
  updateProduct(
    @Param('productId') productId: string,
    @Body() updateProduct: UpdateProductDto,
    @TokenPayloadParam() payload: PayloadDto,
  ) {
    return this.productsService.update(productId, updateProduct, payload);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @UseGuards(AuthTokenGuard)
  @Patch('soft-delete/:productId')
  softDeleteProduct(
    @Param('productId') productId: string,
    @TokenPayloadParam() payload: PayloadDto,
  ) {
    return this.productsService.softDelete(productId, payload);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @UseGuards(AuthTokenGuard)
  @Delete(':productId')
  deleteProduct(
    @Param('productId') productId: string,
    @TokenPayloadParam() payload: PayloadDto,
  ) {
    return this.productsService.delete(productId, payload);
  }
}
