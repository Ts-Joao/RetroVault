import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateProductDto } from './dto/create.product.dto';
import { UpdateProductDto } from './dto/update.product.dto';

@Injectable()
export class ProductService {
    constructor(private readonly databaseService: DatabaseService) {}

    async create(createProductDto: CreateProductDto) {
        try {
            const newProduct = await this.databaseService.product.create({
                data: {
                    name: createProductDto.name,
                    price: createProductDto.price,
                    description: createProductDto.description,
                }
            });
            return newProduct;
        } catch (err) {
            throw err
        };
    }

    async get() {
        try {
            const findProduct = await this.databaseService.product.findMany()

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
