import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';
import slugify from 'slugify';

@Injectable()
export class ProductService {
    constructor(private readonly databaseService: DatabaseService) {}

    private async generateSlug(name: string): Promise<string> {
        const base = slugify(name, { lower: true, strict: true, });

        const existing = await this.databaseService.product.findUnique({
            where: { slug: base },
            select: { slug: true },
        });

        if (!existing) {
            return base;
        }

        const suffix = Math.random().toString(36).substring(2, 10);

        return `${base}-${suffix}`;
    }

    async create(createProductDto: CreateProductDto, sellerId: string) {
        try {
            const findSeller = await this.databaseService.user.findUnique({
                where: { id: sellerId }
            });

            if (!findSeller) {
                throw new NotFoundException('Seller not found');
            }

            if (findSeller.role != 'SELLER') {
                throw new UnauthorizedException('User is not a seller');
            }

            const slug = await this.generateSlug(createProductDto.name);

            const newProduct = await this.databaseService.product.create({
                data: {
                    ...createProductDto,
                    slug: slug,
                    sellerId: sellerId
                }
            });
            return newProduct;
        } catch (err) {
            console.error('Erro ao criar produto')
            throw err
        };
    }

    async get() {
        try {
            const findProduct = await this.databaseService.product.findMany({
                where: {
                    isActive: true
                },
                include: {
                    photos: true
                }
            })

            return findProduct;
        } catch (err) {
            throw new HttpException (
                'Error getting products!',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        };
    }

    async getById(id: string) {
        try {
            const findProduct = await this.databaseService.product.findUnique({
                where: { id }
            });

            if (!findProduct) {
                throw new NotFoundException('Product not found');
            }
            return findProduct;
        } catch (err) {
            throw new HttpException(
                'Error finding product',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        };
    }

    async getBySellerId(sellerId: string) {
        const seller = await this.databaseService.user.findUnique({
            where: {
                id: sellerId,
                role:'SELLER'
            },
        })

        if (!seller) {
            throw new NotFoundException('Seller Not Found!')
        }

        return await this.databaseService.product.findMany({
            where: {
                sellerId: seller.id,
                isActive: true
            }
        })
    }

    async getAllBySellerId(sellerId: string) {
        const seller = await this.databaseService.user.findUnique({
            where: {
                id: sellerId,
                role:'SELLER'
            },
        })

        if (!seller) {
            throw new NotFoundException('Seller Not Found!')
        }
        
        return await this.databaseService.product.findMany({
            where: { sellerId: seller.id }
        })
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        try {
            const findProduct = await this.databaseService.product.findUnique({
                where: { id }
            });

            if (!findProduct) {
                throw new NotFoundException('Product not found');
            }

            let slug = findProduct.slug;
            if (updateProductDto.name && updateProductDto.name !== findProduct.name) {
                slug = await this.generateSlug(updateProductDto.name);
            }
            
            const updateProduct = await this.databaseService.product.update({
                where: { id },
                data: {
                    ...updateProductDto,
                    slug
                }
            });

            return updateProduct;
        } catch (err) {
            throw new HttpException(
                'Error updating product!',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        };
    }

    async softDelete(id: string) {
        try {
            const findProduct = await this.databaseService.product.findUnique({
                where: { id }
            });

            if (!findProduct) {
                throw new NotFoundException('Product not found');
            }

            const softDeleteProduct = await this.databaseService.product.update({
                where: { id },
                data: { isActive: false }
            });

            return softDeleteProduct;
        } catch (err) {
            throw new HttpException(
                'Error soft deleting product!',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        };
    }

    async delete(id: string) {
        try {
            const findProduct = await this.databaseService.product.findUnique({
                where: { id }
            });

            if (!findProduct) {
                throw new NotFoundException('Product not fund');
            }

            const deleteProduct = await this.databaseService.product.delete({
                where: { id }
            });

            return deleteProduct;
        }catch (err) {
            throw new HttpException(
                'Error deleting product!',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}
