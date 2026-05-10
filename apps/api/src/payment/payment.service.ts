import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { randomUUID } from 'crypto';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
    constructor(private readonly databaseSerivce: DatabaseService) {}

    async simulation(orderId: string, userId: string) {
        try {
            const order = await this.databaseSerivce.order.findFirst({
                where: {
                    id: orderId,
                    userId,
                },
            });

            if (!order) {
                throw new NotFoundException('Order not found');
            }

            if (order.status != OrderStatus.PENDING) {
                throw new BadRequestException("Order is not in pending state");
            }

            const token = randomUUID();
            const datePayment = new Date(Date.now() + 5 * 60 * 1000);

            await this.databaseSerivce.payment.update({
                where: {
                    orderId: orderId,
                },
                data: {
                    confirmationCode: token,
                    tokenExpiresAt: datePayment,
                }
            })

            return token;

        } catch (error) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                console.log(error.message);
                throw error;
            }

            console.log(error);
            throw new InternalServerErrorException('Error to simulation payment');
        }
    }

    async confirmation(token: string) {
        const payment = await this.databaseSerivce.payment.findFirst({
            where: {
                confirmationCode: token,
            }
        })

        if (!payment) {
            throw new NotFoundException("Payment not found");
        }

        if (!payment.tokenExpiresAt) {
            throw new BadRequestException("Payment token has no expiration date");
        }

        if (payment.tokenExpiresAt < new Date()) {
            await this.databaseSerivce.$transaction(async (tx) =>{
                await tx.order.update({
                    where: {
                        id: payment.orderId,
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
            })

            throw new BadRequestException("Payment token is expired");
        }

        if (payment.status != PaymentStatus.PENDING) {
            throw new BadRequestException("Payment is not in pending state");
        }

        await this.databaseSerivce.$transaction( async (tx) => {
            await tx.payment.update({
                where: {
                    confirmationCode: token,
                },
                data: {
                    status: PaymentStatus.CAPTURED,
                },
            });

            await tx.order.update({
                where: {
                    id: payment.orderId,
                },
                data: {
                    status: OrderStatus.PAID,
                },
            });
        })

        return 'Payment confirmed successfully';
    }
}
