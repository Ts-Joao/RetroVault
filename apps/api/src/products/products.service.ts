import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { SlugServiceProtocol } from 'src/common/utils/slug/slug.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly slugService: SlugServiceProtocol,
  ) {}

  async create(createProductDto: CreateProductDto, sellerId: string) {
    try {
      const findSeller = await this.databaseService.user.findUnique({
        where: { id: sellerId },
      });

      if (!findSeller) {
        throw new NotFoundException('Seller not found');
      }

      if (findSeller.role !== 'SELLER') {
        throw new UnauthorizedException('User is not a seller');
      }

      const slug = await this.slugService.generateSlug(createProductDto.name, 'product');

      const newProduct = await this.databaseService.product.create({
        data: {
          ...createProductDto,
          sellerId: sellerId,
          slug,
        },
      });
      return newProduct;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      console.error('Erro ao criar produto');
      throw new InternalServerErrorException('Error creating product!');
    }
  }

  async get() {
    try {
      const findProduct = await this.databaseService.product.findMany({
        where: { isActive: true },
      });
      return findProduct;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('Error getting products!');
    }
  }

  async getById(id: string) {
    try {
      const findProduct = await this.databaseService.product.findUnique({
        where: { id },
      });

      if (!findProduct) {
        throw new NotFoundException('Product not found');
      }
      return findProduct;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('Error finding product');
    }
  }

  async getActiveProductsBySellerId(sellerId: string) {
    try {
      return this.databaseService.product.findMany({
        where: { sellerId, isActive: true },
      });
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('Error getting seller products!');
    }
  }

  async getAllProductsBySellerId(sellerId: string, payload: PayloadDto) {
    try {
      if (payload.sub !== sellerId && payload.role !== 'ADMIN') {
        throw new UnauthorizedException('Not authorized to view these products');
      }
      return this.databaseService.product.findMany({
        where: { sellerId },
      });
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('Error getting seller products!');
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, payload?: PayloadDto) {
    try {
      const findProduct = await this.databaseService.product.findUnique({
        where: { id },
      });

      if (!findProduct) {
        throw new NotFoundException('Product not found');
      }

      if (payload && findProduct.sellerId !== payload.sub && payload.role !== 'ADMIN') {
        throw new UnauthorizedException('Not authorized to update this product');
      }

      const updateProduct = await this.databaseService.product.update({
        where: { id },
        data: updateProductDto,
      });

      return updateProduct;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('Error updating product!');
    }
  }

  async softDelete(id: string, payload?: PayloadDto) {
    try {
      const findProduct = await this.databaseService.product.findUnique({
        where: { id },
      });

      if (!findProduct) {
        throw new NotFoundException('Product not found');
      }

      if (payload && findProduct.sellerId !== payload.sub && payload.role !== 'ADMIN') {
        throw new UnauthorizedException('Not authorized to delete this product');
      }

      const softDeleteProduct = await this.databaseService.product.update({
        where: { id },
        data: { isActive: false },
      });

      return softDeleteProduct;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('Error soft deleting product!');
    }
  }

  async delete(id: string, payload?: PayloadDto) {
    try {
      const findProduct = await this.databaseService.product.findUnique({
        where: { id },
      });

      if (!findProduct) {
        throw new NotFoundException('Product not found');
      }

      if (payload && findProduct.sellerId !== payload.sub && payload.role !== 'ADMIN') {
        throw new UnauthorizedException('Not authorized to delete this product');
      }

      const deleteProduct = await this.databaseService.product.delete({
        where: { id },
      });

      return deleteProduct;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('Error deleting product!');
    }
  }
}