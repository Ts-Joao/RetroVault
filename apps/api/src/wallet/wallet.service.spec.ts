import {
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';

import { WalletService } from './wallet.service';
import { DatabaseService } from 'src/database/database.service';

describe('WalletService', () => {
  let service: WalletService;

  const databaseMock = {
    wallet: {
      findUnique: jest.fn(),
    },
    walletTransaction: {
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: DatabaseService,
          useValue: databaseMock,
        },
      ],
    }).compile();

    service = module.get(WalletService);

    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should return wallet', async () => {
      databaseMock.wallet.findUnique.mockResolvedValue({
        id: 'wallet-id',
        userId: 'user-id',
      });

      const result = await service.get('user-id');

      expect(result.id).toBe('wallet-id');
    });

    it('should throw BadRequestException when userId is missing', async () => {
      await expect(service.get('')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException', async () => {
      databaseMock.wallet.findUnique.mockResolvedValue(null);

      await expect(service.get('user-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getHistory', () => {
    it('should return transaction history', async () => {
      jest.spyOn(service, 'get').mockResolvedValue({
        id: 'wallet-id',
      } as any);

      databaseMock.walletTransaction.findMany.mockResolvedValue([
        { id: '1' },
        { id: '2' },
      ]);

      const result = await service.getHistory('user-id');

      expect(result).toHaveLength(2);
    });
  });

  describe('deposit', () => {
    beforeEach(() => {
      jest.spyOn(service, 'get').mockResolvedValue({
        id: 'wallet-id',
      } as any);
    });

    it('should create deposit request', async () => {
      databaseMock.$transaction.mockImplementation(
        async (callback) => {
          return callback({
            walletTopUp: {
              create: jest.fn().mockResolvedValue({
                id: 'topup-id',
              }),
            },
            payment: {
              create: jest.fn().mockResolvedValue({
                id: 'payment-id',
              }),
            },
          });
        },
      );

      const result = await service.deposit('user-id', {
        amount: 100,
        type: 'DEPOSIT',
        paymentMethod: 'PIX',
      });

      expect(result.walletTopUp.id).toBe('topup-id');
      expect(result.payment.id).toBe('payment-id');
    });

    it('should throw BadRequestException for invalid amount', async () => {
      await expect(
        service.deposit('user-id', {
          amount: 0,
          type: 'DEPOSIT',
          paymentMethod: 'PIX',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('refundWallet', () => {
    const txMock = {
      wallet: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      walletTransaction: {
        create: jest.fn(),
      },
    };

    it('should refund wallet', async () => {
      txMock.wallet.findUnique.mockResolvedValue({
        id: 'wallet-id',
      });

      await service.refundWallet(
        txMock as any,
        {
          id: 'order-id',
          userId: 'user-id',
          totalAmount: 100,
        } as any,
      );

      expect(txMock.wallet.update).toHaveBeenCalled();
      expect(txMock.walletTransaction.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException', async () => {
      txMock.wallet.findUnique.mockResolvedValue(null);

      await expect(
        service.refundWallet(
          txMock as any,
          {
            id: 'order-id',
            userId: 'user-id',
            totalAmount: 100,
          } as any,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('processWalletPayment', () => {
    const txMock = {
      wallet: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      walletTransaction: {
        create: jest.fn(),
      },
    };

    it('should process payment', async () => {
      txMock.wallet.findUnique.mockResolvedValue({
        id: 'wallet-id',
        balance: {
          lessThan: jest.fn().mockReturnValue(false),
        },
      });

      await service.processWalletPayment(
        txMock as any,
        'user-id',
        new Prisma.Decimal(50),
      );

      expect(txMock.wallet.update).toHaveBeenCalled();
      expect(txMock.walletTransaction.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException when wallet does not exist', async () => {
      txMock.wallet.findUnique.mockResolvedValue(null);

      await expect(
        service.processWalletPayment(
          txMock as any,
          'user-id',
          new Prisma.Decimal(50),
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnprocessableEntityException when balance is insufficient', async () => {
      txMock.wallet.findUnique.mockResolvedValue({
        id: 'wallet-id',
        balance: {
          lessThan: jest.fn().mockReturnValue(true),
        },
      });

      await expect(
        service.processWalletPayment(
          txMock as any,
          'user-id',
          new Prisma.Decimal(500),
        ),
      ).rejects.toThrow(UnprocessableEntityException);
    });
  });
});
