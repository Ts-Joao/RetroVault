import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { DepositWalletDto } from './dto/deposit-wallet.dto';
import { Order, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class WalletService {
  constructor(private readonly databaseService: DatabaseService) {}

  async get(userId: string) {
    if (!userId) {
      throw new BadRequestException('User ID is required!');
    }

    const wallet = await this.databaseService.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet Not Found!');
    }

    return wallet;
  }

  async getHistory(userId: string) {
    const wallet = await this.get(userId);

    const history = await this.databaseService.walletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
    });

    return history;
  }

  async deposit(userId: string, dto: DepositWalletDto) {
    const wallet = await this.get(userId);

    if (dto.amount <= 0) {
      throw new BadRequestException('Invalid amount');
    }

    const result = await this.databaseService.$transaction(async (tx) => {
      const walletTopUp = await tx.walletTopUp.create({
        data: {
          walletId: wallet.id,
          amount: dto.amount,
          type: dto.type,
        },
      });

      const payment = await tx.payment.create({
        data: {
          installments: 1,
          paymentMethod: dto.paymentMethod,
          walletTopUpId: walletTopUp.id,
          confirmationCode: randomUUID(),
          tokenExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
      });

      return {
        walletTopUp,
        payment,
      };
    });

    return result;
  }

  async refundWallet(tx: Prisma.TransactionClient, order: Order) {
    const wallet = await tx.wallet.findUnique({
      where: { userId: order.userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet Not Found!');
    }

    await tx.wallet.update({
      where: { userId: order.userId },
      data: { balance: { increment: order.totalAmount } },
    });

    await tx.walletTransaction.create({
      data: {
        type: 'DEPOSIT',
        amount: order.totalAmount,
        description: `Estorno do pedido #${order.id}`,
        walletId: wallet.id,
      },
    });
  }

  async processWalletPayment(
    tx: Prisma.TransactionClient,
    userId: string,
    totalAmount: Prisma.Decimal,
  ) {
    const wallet = await tx.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet Not Found!');
    }

    if (wallet.balance.lessThan(totalAmount)) {
      throw new UnprocessableEntityException('Insufficient wallet balance');
    }

    await tx.wallet.update({
      where: { userId },
      data: {
        balance: {
          decrement: totalAmount,
        },
      },
    });

    await tx.walletTransaction.create({
      data: {
        type: 'WITHDRAWAL',
        amount: totalAmount,
        description: 'Pagamento do pedido',
        walletId: wallet.id,
      },
    });
  }
}
