import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { randomUUID } from 'crypto';
import {
  OrderStatus,
  Payment,
  PaymentStatus,
  TypeWalletTransaction,
} from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private readonly databaseService: DatabaseService) {}

  async simulation(orderId: string, userId: string) {
    try {
      await this.findOrderPending(orderId, userId);

      const token = randomUUID();
      const datePayment = new Date(Date.now() + 5 * 60 * 1000);

      await this.databaseService.payment.update({
        where: {
          orderId: orderId,
        },
        data: {
          confirmationCode: token,
          tokenExpiresAt: datePayment,
        },
      });

      return token;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error to simulation payment');
    }
  }

  async confirmation(token: string) {
    try {
      const payment = await this.getPaymentWithOrder(token);

      await this.isPaymentTokenExpired(payment);

      if (payment.status != PaymentStatus.PENDING) {
        throw new BadRequestException('Payment is not in pending state');
      }

      await this.databaseService.$transaction(async (tx) => {
        await tx.payment.update({
          where: {
            confirmationCode: token,
          },
          data: {
            status: PaymentStatus.CAPTURED,
            paidAt: new Date(),
          },
        });

        if (payment.orderId) {
          await tx.order.update({
            where: {
              id: payment.orderId,
            },
            data: {
              status: OrderStatus.PAID,
            },
          });
        }

        if (payment.walletTopUpId) {
          const walletTopUp = await tx.walletTopUp.findUnique({
            where: {
              id: payment.walletTopUpId,
            },
          });

          if (!walletTopUp) {
            throw new NotFoundException('Wallet top up not found');
          }

          await tx.wallet.update({
            where: {
              id: walletTopUp.walletId,
            },
            data: {
              balance: { increment: walletTopUp.amount },
            },
          });

          await tx.walletTransaction.create({
            data: {
              walletId: walletTopUp.walletId,
              type: TypeWalletTransaction.DEPOSIT,
              amount: walletTopUp.amount,
              paymentId: payment.id,
            },
          });
        }
      });

      return 'Payment confirmed successfully';
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error to confirm payment');
    }
  }

  private async findOrderPending(orderId: string, userId: string) {
    try {
      const order = await this.databaseService.order.findFirst({
        where: {
          id: orderId,
          userId,
        },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.status !== OrderStatus.PENDING) {
        throw new BadRequestException('Order is not in pending state');
      }

      return order;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error to find order');
    }
  }

  private async getPaymentWithOrder(confirmationCode: string) {
    const payment = await this.databaseService.payment.findFirst({
      where: {
        confirmationCode: confirmationCode,
      },
      include: {
        order: true,
        walletTopUp: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  private async isPaymentTokenExpired(payment: Payment) {
    try {
      if (payment.tokenExpiresAt && payment.tokenExpiresAt < new Date()) {
        await this.databaseService.$transaction(async (tx) => {
          await tx.order.update({
            where: {
              id: payment.orderId!,
            },
            data: {
              status: OrderStatus.CANCELED,
            },
          });
          await tx.payment.update({
            where: {
              id: payment.id,
            },
            data: {
              status: PaymentStatus.FAILED,
            },
          });
        });

        throw new UnprocessableEntityException('The payment token has expired');
      }

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error to check payment token');
    }
  }
}
