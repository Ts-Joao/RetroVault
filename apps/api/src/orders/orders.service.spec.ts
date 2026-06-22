import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
  Role,
} from '@prisma/client';

import { OrdersService } from './orders.service';
import { DatabaseService } from 'src/database/database.service';
import { CartService } from 'src/cart/cart.service';
import { ProductService } from 'src/products/products.service';
import { AuthService } from 'src/auth/services/auth.service';
import { WalletService } from 'src/wallet/wallet.service';
import { CouponService } from 'src/coupon/coupon.service';

describe('OrdersService', () => {
  let service: OrdersService;

  const databaseMock = {
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const cartServiceMock = {
    getCart: jest.fn(),
  };

  const productServiceMock = {
    getById: jest.fn(),
  };

  const authServiceMock = {
    validateTokenUser: jest.fn(),
  };

  const walletServiceMock = {
    processWalletPayment: jest.fn(),
    refundWallet: jest.fn(),
  };

  const couponServiceMock = {
    validateCoupon: jest.fn(),
  };

  const payload = {
    sub: 'user-id',
    email: 'user@test.com',
    role: Role.USER,
    aud: 'users',
    iss: 'auth',
    exp: 999999999,
    iat: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: DatabaseService,
          useValue: databaseMock,
        },
        {
          provide: CartService,
          useValue: cartServiceMock,
        },
        {
          provide: ProductService,
          useValue: productServiceMock,
        },
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
        {
          provide: WalletService,
          useValue: walletServiceMock,
        },
        {
          provide: CouponService,
          useValue: couponServiceMock,
        },
      ],
    }).compile();

    service = module.get(OrdersService);

    jest.clearAllMocks();
  });

  describe('checkout', () => {
    it('should checkout from cart', async () => {
      cartServiceMock.getCart.mockResolvedValue({
        id: 'cart-id',
        cartItem: [
          {
            productId: 'product-1',
            amount: 2,
            price: new Prisma.Decimal(100),
          },
        ],
      });

      productServiceMock.getById.mockResolvedValue({
        id: 'product-1',
        amount: 10,
      });

      databaseMock.$transaction.mockImplementation(async (callback) => {
        return callback({
          order: {
            create: jest.fn().mockResolvedValue({
              id: 'order-id',
            }),
          },
          cartItem: {
            deleteMany: jest.fn(),
          },
          product: {
            update: jest.fn(),
          },
          couponUsage: {
            create: jest.fn(),
          },
        });
      });

      const result = await service.checkout('user-id', {
        address: 'Rua A',
        paymentMethod: PaymentMethod.PIX,
      });

      expect(result.id).toBe('order-id');
    });

    it('should checkout using direct order items', async () => {
      productServiceMock.getById.mockResolvedValue({
        amount: 10,
      });

      databaseMock.$transaction.mockImplementation(async (callback) => {
        return callback({
          order: {
            create: jest.fn().mockResolvedValue({
              id: 'order-id',
            }),
          },
          product: {
            update: jest.fn(),
          },
          couponUsage: {
            create: jest.fn(),
          },
          cartItem: {
            deleteMany: jest.fn(),
          },
        });
      });

      const result = await service.checkout('user-id', {
        address: 'Rua A',
        paymentMethod: PaymentMethod.PIX,
        orderItens: [
          {
            productId: 'p1',
            amount: 1,
            price: new Prisma.Decimal(100),
          } as any,
        ],
      });

      expect(result.id).toBe('order-id');
    });

    it('should process wallet payment', async () => {
      productServiceMock.getById.mockResolvedValue({
        amount: 10,
      });

      databaseMock.$transaction.mockImplementation(async (callback) => {
        return callback({
          order: {
            create: jest.fn().mockResolvedValue({
              id: 'order-id',
            }),
          },
          product: {
            update: jest.fn(),
          },
          couponUsage: {
            create: jest.fn(),
          },
          cartItem: {
            deleteMany: jest.fn(),
          },
        });
      });

      await service.checkout('user-id', {
        address: 'Rua A',
        paymentMethod: PaymentMethod.WALLET,
        orderItens: [
          {
            productId: 'p1',
            amount: 1,
            price: new Prisma.Decimal(50),
          } as any,
        ],
      });

      expect(walletServiceMock.processWalletPayment).toHaveBeenCalled();
    });

    it('should apply coupon', async () => {
      productServiceMock.getById.mockResolvedValue({
        amount: 10,
      });

      couponServiceMock.validateCoupon.mockResolvedValue({
        total: 80,
        discount: 20,
        coupon: {
          id: 'coupon-id',
        },
      });

      databaseMock.$transaction.mockImplementation(async (callback) => {
        return callback({
          order: {
            create: jest.fn().mockResolvedValue({
              id: 'order-id',
            }),
          },
          couponUsage: {
            create: jest.fn(),
          },
          product: {
            update: jest.fn(),
          },
          cartItem: {
            deleteMany: jest.fn(),
          },
        });
      });

      const result = await service.checkout('user-id', {
        address: 'Rua A',
        paymentMethod: PaymentMethod.PIX,
        couponCode: 'RETRO10',
        orderItens: [
          {
            productId: 'p1',
            amount: 1,
            price: new Prisma.Decimal(100),
          } as any,
        ],
      });

      expect(result.id).toBe('order-id');
      expect(couponServiceMock.validateCoupon).toHaveBeenCalled();
    });

    it('should throw when cart is empty', async () => {
      cartServiceMock.getCart.mockResolvedValue({
        id: 'cart-id',
        cartItem: [],
      });

      await expect(
        service.checkout('user-id', {
          address: 'Rua',
          paymentMethod: PaymentMethod.PIX,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when stock is insufficient', async () => {
      productServiceMock.getById.mockResolvedValue({
        amount: 1,
      });

      await expect(
        service.checkout('user-id', {
          address: 'Rua',
          paymentMethod: PaymentMethod.PIX,
          orderItens: [
            {
              productId: 'p1',
              amount: 5,
              price: new Prisma.Decimal(100),
            } as any,
          ],
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return orders', async () => {
      databaseMock.order.findMany.mockResolvedValue([{ id: '1' }, { id: '2' }]);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
    });
  });

  describe('findAllByUserId', () => {
    it('should return user orders', async () => {
      authServiceMock.validateTokenUser.mockResolvedValue(true);

      databaseMock.order.findMany.mockResolvedValue([{ id: '1' }]);

      const result = await service.findAllByUserId(payload as any, 'user-id');

      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return order', async () => {
      authServiceMock.validateTokenUser.mockResolvedValue(true);

      databaseMock.order.findUnique.mockResolvedValue({
        id: 'order-id',
      });

      const result = await service.findOne(
        payload as any,
        'order-id',
        'user-id',
      );

      expect(result.id).toBe('order-id');
    });

    it('should throw NotFoundException', async () => {
      authServiceMock.validateTokenUser.mockResolvedValue(true);

      databaseMock.order.findUnique.mockResolvedValue(null);

      await expect(
        service.findOne(payload as any, 'order-id', 'user-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePaymentStatus', () => {
    it('should update payment status', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({
        id: 'order-id',
      } as any);

      databaseMock.order.update.mockResolvedValue({
        id: 'order-id',
      });

      const result = await service.updatePaymentStatus(
        payload as any,
        'order-id',
        {
          paymentStatus: PaymentStatus.CAPTURED,
        },
      );

      expect(result.id).toBe('order-id');
    });
  });

  describe('updateStatus', () => {
    it('should update status', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({
        id: 'order-id',
        status: OrderStatus.PENDING,
        payment: {
          status: PaymentStatus.PENDING,
        },
        orderItems: [],
      } as any);

      databaseMock.$transaction.mockImplementation(async (callback) => {
        return callback({
          order: {
            update: jest.fn().mockResolvedValue({
              id: 'order-id',
              status: OrderStatus.SHIPPED,
            }),
          },
          product: {
            update: jest.fn(),
          },
        });
      });

      const result = await service.updateStatus(payload as any, 'order-id', {
        status: OrderStatus.SHIPPED,
      });

      expect(result.status).toBe(OrderStatus.SHIPPED);
    });

    it('should restore stock and refund wallet when canceled', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({
        id: 'order-id',
        userId: 'user-id',
        totalAmount: 100,
        status: OrderStatus.PENDING,
        payment: {
          status: PaymentStatus.CAPTURED,
        },
        orderItems: [
          {
            productId: 'product-id',
            amount: 2,
          },
        ],
      } as any);

      databaseMock.$transaction.mockImplementation(async (callback) => {
        return callback({
          order: {
            update: jest.fn().mockResolvedValue({
              status: OrderStatus.CANCELED,
            }),
          },
          product: {
            update: jest.fn(),
          },
        });
      });

      await service.updateStatus(payload as any, 'order-id', {
        status: OrderStatus.CANCELED,
      });

      expect(walletServiceMock.refundWallet).toHaveBeenCalled();
    });

    it('should throw when order already canceled', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({
        status: OrderStatus.CANCELED,
      } as any);

      await expect(
        service.updateStatus(payload as any, 'order-id', {
          status: OrderStatus.SHIPPED,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
