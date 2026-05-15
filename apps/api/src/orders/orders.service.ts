import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, PaymentMethod, PaymentStatus, Prisma } from '@prisma/client';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
    constructor(private readonly databaseService: DatabaseService) { }

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

        cart.cartItem.map((cartItem) => {
            console.log(cartItem.product.amount)
            console.log(cartItem.amount)
            if (cartItem.amount > cartItem.product.amount) {
                throw new BadRequestException('Product out of stock!')
            }
        })

        const totalAmount = cart.cartItem.reduce((sum, item) => {
            return sum.add(new Prisma.Decimal(item.price).mul(item.amount))
        }, new Prisma.Decimal(0))

        const order = await this.databaseService.$transaction(async (tx) =>{
            if (dto.paymentMethod === PaymentMethod.WALLET) {
                const wallet = await tx.wallet.findUnique({ where: { userId } })

                if (!wallet) {
                    throw new NotFoundException('Wallet Not Found!')
                }
                if (wallet.balance.lessThan(totalAmount)) {
                    throw new UnprocessableEntityException('Saldo insuficiente na wallet')
                }

                await tx.wallet.update({
                    where: { userId },
                    data: { balance: { decrement: totalAmount } }
                })

                await tx.walletTransaction.create({
                    data: {
                        type: 'DEPOSIT',
                        amount: totalAmount,
                        description: 'Pagamento do pedido com wallet',
                        walletId: wallet.id
                    }
                })
            }
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
                            status: dto.paymentMethod === PaymentMethod.WALLET
                                ? PaymentStatus.CAPTURED
                                : PaymentStatus.PENDING,
                            paymentMethod: dto.paymentMethod,
                            installments: dto.installments ?? 1
                        }
                    }
                },
                include: {
                    orderItems: { include: { product: true } },
                    payment: true
                }
            })
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id}
            })

            await Promise.all(
                cart.cartItem.map((item) =>
                    tx.product.update({
                        where: { id: item.productId },
                        data: {
                            amount: {
                                decrement: item.amount
                            }
                        }
                    })
                )
            )

            return newOrder
        })

        return order
    }

    async findAll() {
        return this.databaseService.order.findMany({
            include: {
                orderItems: { include: { product: true } },
                payment: true
            },
            orderBy: { orderDate: 'desc' }
        })
    }

    async findAllByUserId(userId: string) {
        return this.databaseService.order.findMany({
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

    async updatePaymentStatus(id: string, dto: UpdateOrderDto) {
        const order = await this.databaseService.order.findUnique({
            where: { id },
            include: { payment: true }
        })

        if (!order) {
            throw new NotFoundException('Order Not Found!')
        }

        return this.databaseService.order.update({
            where: { id },
            data: {
                payment: {
                    update: {
                        status: dto.paymentStatus
                    }
                }
            }
        })
    }

    async updateStatus(user: any, id: string, dto: UpdateOrderDto) {
        const order = await this.databaseService.order.findUnique({
            where: { id },
            include: { payment: true, orderItems: { include: { product: true } } }
        })

        if (!order) {
            throw new NotFoundException('Order Not Found!')
        }

        const isBuyer = order.userId === user.sub;
        const isAdmin = user.role === 'ADMIN';
        const isSeller = order.orderItems.some(item => item.product.sellerId === user.sub);

        if (!isBuyer && !isAdmin && !isSeller) {
            throw new ForbiddenException('Não autorizado a alterar o status deste pedido');
        }

        if (order.status === 'CANCELED') {
            throw new BadRequestException('Order Already Canceled!')
        }

        return this.databaseService.$transaction(async (tx) => {
            const updateOrder = await tx.order.update({
                where: { id },
                data: {
                    status: dto.status
                }
            })

            const isCaptured = order.payment?.status === 'CAPTURED'
            const isCanceled = dto.status === 'CANCELED'
            
            if (isCanceled) {
                await Promise.all(
                    order.orderItems.map(async (item) => {
                        await tx.product.update({
                            where: { id: item.productId },
                            data: {
                                amount: { increment: item.amount }
                            }
                        })
                    })
                )
            }

            if (isCanceled && isCaptured) {
                const wallet = await tx.wallet.findUnique({
                    where: { userId: order.userId }
                })

                if (!wallet) {
                    throw new NotFoundException('Wallet Not Found!')
                }
    
                await tx.wallet.update({
                    where: { userId: order.userId },
                    data: { balance: { increment: order.totalAmount } }
                })
    
                await tx.walletTransaction.create({
                    data: {
                        type: 'DEPOSIT',
                        amount: order.totalAmount,
                        description: `Estorno do pedido #${id}`,
                        walletId: wallet.id
                    }
                })
                
                await Promise.all(
                    order.orderItems.map(async (item) => {
                        await tx.product.update({
                            where: { id: item.productId },
                            data: {
                                amount: { increment: item.amount }
                            }
                        })
                    })
                )
            }
            
            return updateOrder
        })
    }
}
