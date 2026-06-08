import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { SlugServiceProtocol } from 'src/common/utils/slug/slug.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly slugService: SlugServiceProtocol,
    private readonly authService: AuthService,
  ) {}

  async create(createProductDto: CreateProductDto, sellerId: string) {
    try {
      await this.authService.verifyIsSeller(sellerId);

      const slug = await this.slugService.generateSlug(
        createProductDto.name,
        'product',
      );

      return await this.databaseService.product.create({
        data: {
          ...createProductDto,
          slug,
          sellerId: sellerId,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error creating product!');
    }
  }

  async get() {
    try {
      return await this.databaseService.product.findMany({
        where: {
          isActive: true,
        },
        include: {
          photos: true,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error finding product!');
    }
  }

  async getActiveProductsBySellerId(sellerId: string) {
    try {
      await this.authService.verifyIsSeller(sellerId);

      const products = await this.databaseService.product.findMany({
        where: {
          sellerId: sellerId,
          isActive: true,
        },
        include: { photos: true },
      });

      return products;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error getting products!');
    }
  }

  async getAllProductsBySellerId(sellerId: string, tokenPayload: PayloadDto) {
    try {
      await this.authService.verifyIsSeller(sellerId);

      await this.authService.validateTokenUser(tokenPayload, sellerId)

      const products = await this.databaseService.product.findMany({
        where: { sellerId },
        include: { photos: true },
      });

      return products;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error getting products!');
    }
  }

  async update(
    productId: string,
    updateProductDto: UpdateProductDto,
    tokenPayload: PayloadDto,
  ) {
    try {
      const findProduct = await this.getById(productId);

      await this.authService.validateTokenUser(tokenPayload, findProduct.sellerId)

      const slug = await this.slugService.adjustSlug(
        findProduct.name,
        updateProductDto.name,
        findProduct.slug,
        'product',
      );

      const updateProduct = await this.databaseService.product.update({
        where: { id: findProduct.id },
        data: {
          ...updateProductDto,
          slug,
        },
      });

      return updateProduct;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error updating product!');
    }
  }

  async softDelete(id: string, tokenPayload: PayloadDto) {
    try {
      const findProduct = await this.getById(id);

      await this.authService.validateTokenUser(tokenPayload, findProduct.sellerId)

      const softDeleteProduct = await this.databaseService.product.update({
        where: { id: findProduct.id },
        data: { isActive: false },
      });

      return softDeleteProduct;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error soft deleting product!');
    }
  }

  async delete(id: string, tokenPayload: PayloadDto) {
    try {
      const findProduct = await this.getById(id);

      await this.authService.validateTokenUser(tokenPayload, findProduct.sellerId)

      const deleteProduct = await this.databaseService.product.delete({
        where: { id: findProduct.id },
      });

      return deleteProduct;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error deleting product!');
    }
  }
}
