import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import { UsersService } from 'src/users/users.service';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { SlugServiceProtocol } from 'src/common/utils/slug/slug.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly usersService: UsersService,
    private readonly slugService: SlugServiceProtocol,
  ) {}

  async create(createProductDto: CreateProductDto, sellerId: string) {
    try {
      await this.usersService.verifyIsSeller(sellerId);

      const slug = await this.slugService.generateSlug(
        createProductDto.name,
        'product',
      );

      const newProduct = await this.databaseService.product.create({
        data: {
          ...createProductDto,
          slug,
          sellerId: sellerId,
        },
      });
      return newProduct;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error creating product!');
    }
  }

  async get() {
    try {
      const findProduct = await this.databaseService.product.findMany({
        where: {
          isActive: true,
        },
        include: {
          photos: true,
        },
      });

      return findProduct;
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
      const seller = await this.usersService.verifyIsSeller(sellerId);

      const products = await this.databaseService.product.findMany({
        where: {
          sellerId: seller.id,
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

  async getAllProductsBySellerId(sellerId: string) {
    try {
      const seller = await this.usersService.verifyIsSeller(sellerId);

      const products = await this.databaseService.product.findMany({
        where: { sellerId: seller.id },
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

      if (tokenPayload.sub !== findProduct.sellerId) {
        throw new ForbiddenException(
          'You are not authorized to update this product!',
        );
      }

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

  async softDelete(id: string) {
    try {
      const findProduct = await this.getById(id);

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

  async delete(id: string) {
    try {
      const findProduct = await this.getById(id);

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

  async verifySellerOwnership(sellerId: string, payload: PayloadDto) {
    try {
      const findSeller = await this.usersService.verifyIsSeller(sellerId);

      if (
        sellerId !== payload.sub ||
        !(payload.role === 'SELLER' || payload.role === 'ADMIN')
      ) {
        throw new ForbiddenException(
          'You are not authorized to perform this action!',
        );
      }

      return findSeller;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error verifying seller ownership!');
    }
  }
}
