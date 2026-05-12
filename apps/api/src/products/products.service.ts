import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';

@Injectable()
export class ProductService {
    constructor(private readonly databaseService: DatabaseService) {}

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

            const newProduct = await this.databaseService.product.create({
                data: {
                    ...createProductDto,
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

    async update(id: string, UpdateProductDto: UpdateProductDto) {
        try {
            const findProduct = await this.databaseService.product.findUnique({
                where: { id }
            });

            if (!findProduct) {
                throw new NotFoundException('Product not found');
            }
            
            const updateProduct = await this.databaseService.product.update({
                where: { id },
                data: UpdateProductDto
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
