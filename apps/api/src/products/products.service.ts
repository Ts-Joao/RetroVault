import {
  BadRequestException,
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
import { ShippingService } from 'src/shipping/shipping.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly slugService: SlugServiceProtocol,
    private readonly shippingService: ShippingService,
  ) {}

  async create(createProductDto: CreateProductDto, sellerId: string) {
    try {
      const findSeller = await this.databaseService.user.findUnique({
        where: { id: sellerId },
      });

      if (!findSeller) throw new NotFoundException('Seller not found');
      if (findSeller.role !== 'SELLER')
        throw new UnauthorizedException('User is not a seller');

      const slug = await this.slugService.generateSlug(
        createProductDto.name,
        'product',
      );

      const { genres, cep, ...productData } = createProductDto;

      const cepInfo = await this.shippingService.verifyAddress(cep);

      const newProduct = await this.databaseService.product.create({
        data: {
          ...productData,
          sellerId,
          slug,
          cep: cepInfo.cep,
          city: cepInfo.localidade,
          state: cepInfo.uf,
          ...(genres && genres.length > 0
            ? {
                genre: {
                  connectOrCreate: genres.map((name) => ({
                    where: { name },
                    create: { name },
                  })),
                },
              }
            : {}),
        },
        include: { photos: true, genre: true },
      });

      return newProduct;
    } catch (err) {
      if (err instanceof HttpException) throw err;

      throw new InternalServerErrorException('Error creating product!');
    }
  }

  async get() {
    try {
      return await this.databaseService.product.findMany({
        where: { isActive: true },
        include: {
          photos: true,
          seller: { select: { id: true, name: true, slug: true } },
        },
      });
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('Error getting products!');
    }
  }

  async getMediaTypes() {
    return this.databaseService.mediaType.findMany();
  }

  async getById(id: string) {
    try {
      const findProduct = await this.databaseService.product.findUnique({
        where: { id },
        include: {
          photos: true,
          seller: true,
          mediaType: true,
          genre: true,
        },
      });

      if (!findProduct) throw new NotFoundException('Product not found');

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
        include: {
          photos: true,
          seller: { select: { id: true, name: true, slug: true } },
        },
      });
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('Error getting seller products!');
    }
  }

  async getAllProductsBySellerId(sellerId: string, payload: PayloadDto) {
    try {
      if (payload.sub !== sellerId && payload.role !== 'ADMIN') {
        throw new UnauthorizedException(
          'Not authorized to view these products',
        );
      }
      return this.databaseService.product.findMany({
        where: { sellerId },
        include: {
          photos: true,
          seller: { select: { id: true, name: true, slug: true } },
        },
      });
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('Error getting seller products!');
    }
  }

 async update(
  id: string,
  updateProductDto: UpdateProductDto,
  payload?: PayloadDto,
) {
  try {
    const findProduct = await this.databaseService.product.findUnique({
      where: { id },
    });
 
    if (!findProduct) {
      throw new NotFoundException('Product not found');
    }
 
    if (
      payload &&
      findProduct.sellerId !== payload.sub &&
      payload.role !== 'ADMIN'
    ) {
      throw new UnauthorizedException(
        'Not authorized to update this product',
      );
    }
 
    // BUG FIX: extrair genres do DTO e tratar o relacionamento N:N separadamente.
    // Antes, genres era passado direto no data e causava erro ou era ignorado.
    const { genres, ...productData } = updateProductDto as any;
 
    const updateProduct = await this.databaseService.product.update({
      where: { id },
      data: {
        ...productData,
        ...(genres !== undefined
          ? {
              genre: {
                set: [], // desconecta todos os gêneros atuais
                connectOrCreate: (genres as string[]).map((name: string) => ({
                  where: { name },
                  create: { name },
                })),
              },
            }
          : {}),
      },
      include: { photos: true, genre: true },
    });
 
    return updateProduct;
  } catch (err) {
    if (err instanceof HttpException) throw err;
    throw new InternalServerErrorException('Error updating product!');
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

      if (
        payload &&
        findProduct.sellerId !== payload.sub &&
        payload.role !== 'ADMIN'
      ) {
        throw new UnauthorizedException(
          'Not authorized to delete this product',
        );
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

  async getActiveProducts() {
    try {
      const products = await this.databaseService.product.findMany({
        where: { isActive: true, amount: { gt: 0 } },
        include: {
          photos: true,
          seller: { select: { id: true, name: true, slug: true } },
          mediaType: true,
          genre: true,
        },
      });

      if (!products) {
        throw new NotFoundException('No active products found');
      }

      return products;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('Error getting products!');
    }
  }

  async getActiveProductById(id: string) {
    try {
      await this.getById(id);

      const findProduct = await this.databaseService.product.findUnique({
        where: { id, isActive: true, amount: { gt: 0 } },
        include: {
          photos: true,
          seller: { select: { id: true, name: true, slug: true } },
          mediaType: true,
          genre: true,
        },
      });

      if (!findProduct) {
        throw new BadRequestException('Product is not active');
      }

      return findProduct;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('Error getting product!');
    }
  }
}
