import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { DepositWalletDto } from './dto/deposit-wallet.dto';
import { Order, Prisma } from '@prisma/client';

@Injectable()
export class WalletService {
  constructor(private readonly databaseService: DatabaseService) {}

  async get(userId: string) {
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

    return this.databaseService.$transaction(async (tx) => {
      const updated = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: dto.amount } },
      });

      await tx.walletTransaction.create({
        data: {
          type: 'DEPOSIT',
          description: `Depósito de R$ ${dto.amount.toFixed(2)} realizado!`,
          amount: dto.amount,
          walletId: wallet.id,
        },
      });

      return updated;
    });
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
        type: 'WITHDRAWAL',
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
      data: { balance: { decrement: totalAmount } },
    });

    await tx.walletTransaction.create({
      data: {
        type: 'DEPOSIT',
        amount: totalAmount,
        description: 'Pagamento do pedido',
        walletId: wallet.id,
      },
    });
  }
}
