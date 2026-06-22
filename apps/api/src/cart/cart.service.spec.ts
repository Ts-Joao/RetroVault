import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CartService } from './cart.service';
import { DatabaseService } from 'src/database/database.service';
import { ProductService } from 'src/products/products.service';
import { Role } from '@prisma/client';

describe('CartService', () => {
  let service: CartService;

  const databaseMock = {
    cart: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    cartItem: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const productServiceMock = {
    getById: jest.fn(),
    getActiveProductById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: DatabaseService,
          useValue: databaseMock,
        },
        {
          provide: ProductService,
          useValue: productServiceMock,
        },
      ],
    }).compile();

    service = module.get(CartService);

    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('should return existing cart', async () => {
      databaseMock.cart.findUnique.mockResolvedValue({
        id: 'cart-id',
      });

      const result = await service.getCart('user-id');

      expect(result.id).toBe('cart-id');
    });

    it('should create cart if not exists', async () => {
      databaseMock.cart.findUnique.mockResolvedValue(null);

      databaseMock.cart.create.mockResolvedValue({
        id: 'cart-id',
      });

      const result = await service.getCart('user-id');

      expect(databaseMock.cart.create).toHaveBeenCalled();
      expect(result.id).toBe('cart-id');
    });

    it('should throw InternalServerErrorException', async () => {
      databaseMock.cart.findUnique.mockRejectedValue(
        new Error(),
      );

      await expect(
        service.getCart('user-id'),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('addItem', () => {
    beforeEach(() => {
      jest.spyOn(service, 'getCart').mockResolvedValue({
        id: 'cart-id',
      } as any);

      productServiceMock.getActiveProductById.mockResolvedValue(
        {},
      );

      productServiceMock.getById.mockResolvedValue({
        id: 'product-id',
        price: 100,
      });
    });

    it('should create item', async () => {
      databaseMock.cartItem.findUnique.mockResolvedValue(
        null,
      );

      databaseMock.cartItem.create.mockResolvedValue({
        id: 'item-id',
      });

      const result = await service.addItem('user-id', {
        productId: 'product-id',
        amount: 2,
      });

      expect(result.id).toBe('item-id');
    });

    it('should update existing item', async () => {
      databaseMock.cartItem.findUnique.mockResolvedValue({
        id: 'item-id',
        amount: 2,
      });

      databaseMock.cartItem.update.mockResolvedValue({
        id: 'item-id',
        amount: 5,
      });

      const result = await service.addItem('user-id', {
        productId: 'product-id',
        amount: 3,
      });

      expect(result.amount).toBe(5);
    });
  });

  describe('removeItem', () => {
    beforeEach(() => {
      jest.spyOn(service, 'getCart').mockResolvedValue({
        id: 'cart-id',
      } as any);
    });

    it('should remove item', async () => {
      databaseMock.cartItem.findFirst.mockResolvedValue({
        id: 'item-id',
      });

      const result = await service.removeItem(
        'user-id',
        'cart-id',
        'item-id',
      );

      expect(result).toEqual({
        where: 'Item removed sucessfully',
      });
    });

    it('should throw NotFoundException', async () => {
      databaseMock.cartItem.findFirst.mockResolvedValue(
        null,
      );

      await expect(
        service.removeItem(
          'user-id',
          'cart-id',
          'item-id',
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('clearCart', () => {
    it('should clear cart', async () => {
      jest.spyOn(service, 'getCart').mockResolvedValue({
        id: 'cart-id',
      } as any);

      const result = await service.clearCart(
        {
          sub: 'user-id',
          email: 'user@test.com',
          role: Role.USER,
        } as any,
        'cart-id',
      );

      expect(
        databaseMock.cartItem.deleteMany,
      ).toHaveBeenCalled();

      expect(result.message).toBe(
        'cart successfully emptied',
      );
    });
  });

  describe('updateItemAmount', () => {
    beforeEach(() => {
      jest.spyOn(service, 'getCart').mockResolvedValue({
        id: 'cart-id',
      } as any);
    });

    it('should update amount', async () => {
      databaseMock.cartItem.findFirst.mockResolvedValue({
        id: 'item-id',
      });

      databaseMock.cartItem.update.mockResolvedValue({
        id: 'item-id',
        amount: 10,
      });

      const result = await service.updateItemAmount(
        'user-id',
        'item-id',
        10,
      );

      expect(result.amount).toBe(10);
    });

    it('should throw NotFoundException', async () => {
      databaseMock.cartItem.findFirst.mockResolvedValue(
        null,
      );

      await expect(
        service.updateItemAmount(
          'user-id',
          'item-id',
          10,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getCartTotal', () => {
    it('should return total', async () => {
      jest.spyOn(service, 'getCart').mockResolvedValue({
        cartItem: [
          {
            amount: 2,
            price: 100,
          },
          {
            amount: 1,
            price: 50,
          },
        ],
      } as any);

      const result = await service.getCartTotal({
        sub: 'user-id',
      } as any);

      expect(result.total).toBe('250.00');
      expect(result.itemCount).toBe(3);
    });
  });
});