import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  OrderStatus,
  PaymentStatus,
} from '@prisma/client';

import { DatabaseService } from '../database/database.service';
import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  let service: PaymentService;

  const prismaMock = {
    payment: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },

    order: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },

    walletTopUp: {
      findUnique: jest.fn(),
    },

    wallet: {
      update: jest.fn(),
    },

    walletTransaction: {
      create: jest.fn(),
    },

    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: DatabaseService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get(PaymentService);

    jest.clearAllMocks();

    prismaMock.$transaction.mockImplementation(async (callback) => {
      return callback({
        payment: prismaMock.payment,
        order: prismaMock.order,
        walletTopUp: prismaMock.walletTopUp,
        wallet: prismaMock.wallet,
        walletTransaction: prismaMock.walletTransaction,
      });
    });
  });

  describe('simulation', () => {
    it('should generate payment token', async () => {
      prismaMock.order.findFirst.mockResolvedValue({
        id: 'order-id',
        userId: 'user-id',
        status: OrderStatus.PENDING,
      });

      const result = await service.simulation(
        'order-id',
        'user-id',
      );

      expect(result).toBeDefined();

      expect(prismaMock.payment.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when order not exists', async () => {
      prismaMock.order.findFirst.mockResolvedValue(null);

      await expect(
        service.simulation(
          'invalid-order',
          'user-id',
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when order is not pending', async () => {
      prismaMock.order.findFirst.mockResolvedValue({
        id: 'order-id',
        status: OrderStatus.PAID,
      });

      await expect(
        service.simulation(
          'order-id',
          'user-id',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('confirmation', () => {
    it('should confirm payment', async () => {
      prismaMock.payment.findFirst.mockResolvedValue({
        id: 'payment-id',
        orderId: 'order-id',
        walletTopUpId: null,
        status: PaymentStatus.PENDING,
        tokenExpiresAt: new Date(Date.now() + 60000),
      });

      const result = await service.confirmation(
        'valid-token',
      );

      expect(result).toBe(
        'Payment confirmed successfully',
      );

      expect(prismaMock.payment.update).toHaveBeenCalled();
      expect(prismaMock.order.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException when token is invalid', async () => {
      prismaMock.payment.findFirst.mockResolvedValue(
        null,
      );

      await expect(
        service.confirmation('invalid-token'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when payment is not pending', async () => {
      prismaMock.payment.findFirst.mockResolvedValue({
        id: 'payment-id',
        orderId: 'order-id',
        walletTopUpId: null,
        status: PaymentStatus.CAPTURED,
        tokenExpiresAt: new Date(Date.now() + 60000),
      });

      await expect(
        service.confirmation('token'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});