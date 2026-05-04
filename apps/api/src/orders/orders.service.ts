import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentStatus, Prisma } from '@prisma/client';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
    constructor(private readonly databaseService: DatabaseService) {}

    async checkout(userId: string, dto: CreateOrderDto) {
        const cart = await this.databaseService.cart.findUnique({
            where: { userId },
            include: {
                cartItem: {
                    include: { product: true }
                }
            }
        })

        if (!cart) {
            throw new NotFoundException('Cart not found!')
        }
        if (cart.cartItem.length === 0) {
            throw new BadRequestException('Cart Empty!')
        }

        const totalAmount = cart.cartItem.reduce((sum, item) => {
            return sum.add(new Prisma.Decimal(item.price).mul(item.amount))
        }, new Prisma.Decimal(0))

        const order = await this.databaseService.$transaction(async (tx) =>{
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    address: dto.address,
                    totalAmount,
                    orderItems: {
                        create: cart.cartItem.map((item) => ({
                            productId: item.productId,
                            amount: item.amount,
                            price: item.price
                        }))
                    },
                    payment: {
                        create: {
                            status: PaymentStatus.PENDING,
                            paymentMethod: dto.paymentMethod,
                            installments: dto.installments ?? 1
                        }
                    }
                },
                include: {
                    orderItems: {
                        include: { product: true }
                    },
                    payment: true
                }
            })
            tx.cartItem.deleteMany({
                where: { cartId: cart.id}
            })

            return newOrder
        })

        return order
    }

    async findAllByUser(userId: string) {
        return this.databaseService.order.findFirst({
            where: { userId },
            include: {
                orderItems: { include: { product: true } },
                payment: true
            },
            orderBy: { orderDate: 'desc' }
        })
    }

    async findOne(userId: string, id: string) {
        const order = await this.databaseService.order.findFirst({
            where: { id, userId },
            include: {
                orderItems: { include: { product: true } },
                payment: true
            }
        })

        if (!order) {
            throw new NotFoundException('Order Not Found!')
        }
        return order
    }

    async updateStatus(id: string, dto: UpdateOrderDto) {
        return await this.databaseService.order.update({
            where: { id },
            data: { status: dto.status }
        })
    }
}
