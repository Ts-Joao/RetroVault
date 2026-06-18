import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AddItemDto } from './dto/add.item.dto';
import { ProductService } from 'src/products/products.service';
import { PayloadDto } from 'src/auth/dto/payload.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly productService: ProductService,
  ) {}

  async getCart(userId: string) {
    try {
      let findCart = await this.databaseService.cart.findUnique({
        where: { userId },
        include: {
          cartItem: {
            include: { product: { include: { photos: true } } },
          },
        },
      });

      if (!findCart) {
        // create an empty cart for the user so items can be added and persisted
        findCart = await this.databaseService.cart.create({
          data: { userId },
          include: {
            cartItem: {
              include: { product: true },
            },
          },
        });
      }

      return findCart;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error getting cart');
    }
  }

  async addItem(userId: string, dto: AddItemDto) {
    try {
      const cart = await this.getCart(userId);
      await this.productService.getActiveProductById(dto.productId)

      const product = await this.productService.getById(dto.productId);

      const existing = await this.databaseService.cartItem.findUnique({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId: dto.productId,
          },
        },
      });

      if (existing) {
        return this.databaseService.cartItem.update({
          where: { id: existing.id },
          data: { amount: existing.amount + dto.amount },
          include: { product: true },
        });
      }

      return this.databaseService.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          amount: dto.amount,
          price: product.price,
        },
        include: { product: true },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error adding item to cart');
    }
  }

  async removeItem(userId: string, id: string, itemId: string) {
    try {
      const cart = await this.getCart(userId);

      const item = await this.databaseService.cartItem.findFirst({
        where: { id: itemId, cartId: id },
      });

      if (!item) {
        throw new NotFoundException('Item not found in cart');
      }

      await this.databaseService.cartItem.delete({
        where: { id: itemId, cartId: id },
      });

      return { where: 'Item removed sucessfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error removing item');
    }
  }

  async clearCart(tokenPayload: PayloadDto, cartId: string) {
    try {
      await this.getCart(tokenPayload.sub);

      await this.databaseService.cartItem.deleteMany({
        where: { cartId: cartId }
      });

      return { message: 'cart successfully emptied' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error clearing cart');
    }
  }

  async updateItemAmount(userId: string, cartItemId: string, amount: number) {
    try {
      const cart = await this.getCart(userId);

      const item = await this.databaseService.cartItem.findFirst({
        where: { id: cartItemId, cartId: cart.id },
      });

      if (!item) {
        throw new NotFoundException('Item not found in cart');
      }

      return this.databaseService.cartItem.update({
        where: { id: cartItemId },
        data: { amount },
        include: { product: true },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating item amount');
    }
  }


  async getCartTotal(tokenPayload: PayloadDto) {
    try {
      const cart = await this.getCart(tokenPayload.sub);

      const total = cart.cartItem.reduce((sum, item) => {
        return sum + Number(item.price) * item.amount;
      }, 0);

      return {
        cart,
        total: total.toFixed(2),
        itemCount: cart.cartItem.reduce((sum, item) => sum + item.amount, 0)
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error getting cart total');
    }
  }
}
