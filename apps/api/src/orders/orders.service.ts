import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  CartItem,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Prisma,
} from '@prisma/client';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CartService } from 'src/cart/cart.service';
import { ProductService } from 'src/products/products.service';
import { AuthService } from 'src/auth/auth.service';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { WalletService } from 'src/wallet/wallet.service';
import { CouponService } from 'src/coupon/coupon.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly cartService: CartService,
    private readonly productService: ProductService,
    private readonly authService: AuthService,
    private readonly walletService: WalletService,
    private readonly couponService: CouponService,
  ) {}

  async checkout(userId: string, dto: CreateOrderDto) {
    try {
      let orderItens: CartItem[] = [];

      if (dto.orderItens && dto.orderItens.length > 0) {
        orderItens = dto.orderItens;
      } else {
        await this.validateCart(userId);

      }

      const cart = await this.cartService.getCart(userId)
      await this.validateStock(cart.cartItem);

      const cartTotal = this.calculateCartTotal(cart.cartItem);

      let finalAmount = cartTotal;
      let couponId: string | null = null;

      if (dto.couponCode) {
        const couponResult = await this.couponService.validateCoupon(
          dto.couponCode,
          Number(cartTotal),
          userId,
        );
        finalAmount = new Prisma.Decimal(couponResult.total);
        couponId = couponResult.coupon.id;
      }

      const order = await this.databaseService.$transaction(async (tx) => {
        if (dto.paymentMethod === PaymentMethod.WALLET) {
          await this.walletService.processWalletPayment(tx, userId, finalAmount);
        }

        const newOrder = await tx.order.create({
          data: {
            userId,
            address: dto.address,
            totalAmount: finalAmount,
            status:
              dto.paymentMethod === PaymentMethod.WALLET
                ? OrderStatus.PAID
                : OrderStatus.PENDING,
            orderItems: {
              create: cart.cartItem.map((item) => ({
                productId: item.productId,
                amount: item.amount,
                price: item.price,
              })),
            },
            payment: {
              create: {
                status:
                  dto.paymentMethod === PaymentMethod.WALLET
                    ? PaymentStatus.CAPTURED
                    : PaymentStatus.PENDING,
                paymentMethod: dto.paymentMethod,
                installments: dto.installments ?? 1,
              },
            },
          },
          include: {
            orderItems: { include: { product: true } },
            payment: true,
          },
        });

        if (couponId) {
          await tx.couponUsage.create({
            data: {
              couponId,
              userId,
              orderId: newOrder.id,
            },
          });
        }

        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });

        await Promise.all(
          cart.cartItem.map((item) =>
            tx.product.update({
              where: { id: item.productId },
              data: {
                amount: {
                  decrement: item.amount,
                },
              },
            }),
          ),
        );

        return newOrder;
      });

      return order;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Order Not Found!');
        }
      }

      throw new InternalServerErrorException('Error to create order!');
    }
  }

  async findAll() {
    try {
      return await this.databaseService.order.findMany({
        include: {
          orderItems: { include: { product: true } },
          payment: true,
        },
        orderBy: { orderDate: 'desc' },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error to list orders!');
    }
  }

  async findAllByUserId(tokenPayload: PayloadDto, userId: string) {
    try {
      await this.authService.validateTokenUser(tokenPayload, userId);

      return this.databaseService.order.findMany({
        where: { userId },
        include: {
          orderItems: { include: { product: true } },
          payment: true,
        },
        orderBy: { orderDate: 'desc' },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error to list orders!');
    }
  }

  async findOne(tokenPayload: PayloadDto, orderId: string, userId: string) {
    try {
      await this.authService.validateTokenUser(tokenPayload, userId);

      const order = await this.databaseService.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: { include: { product: true } },
          payment: true,
        },
      });

      if (!order) {
        throw new NotFoundException('Order Not Found!');
      }

      return order;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error to find order!');
    }
  }

  async updatePaymentStatus(
    tokenPayload: PayloadDto,
    orderId: string,
    dto: UpdateOrderDto,
  ) {
    try {
      await this.findOne(tokenPayload, orderId, tokenPayload.sub);

      return this.databaseService.order.update({
        where: { id: orderId },
        data: {
          payment: {
            update: {
              status: dto.paymentStatus,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error to update payment status!');
    }
  }

  async updateStatus(
    tokenPayload: PayloadDto,
    orderId: string,
    dto: UpdateOrderDto,
  ) {
    try {
      const order = await this.findOne(tokenPayload, orderId, tokenPayload.sub);

      this.validateOrderNotCanceled(order);

      return this.databaseService.$transaction(async (tx) => {
        const updateOrder = await tx.order.update({
          where: { id: orderId },
          data: {
            status: dto.status,
          },
        });

        const isCanceled = dto.status === OrderStatus.CANCELED;
        const isCaptured = order.payment?.status === PaymentStatus.CAPTURED;

        if (isCanceled) {
          this.restoreProductStock(tx, order.orderItems);
        }

        if (isCanceled && isCaptured) {
          await this.walletService.refundWallet(tx, order);
        }

        return updateOrder;
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }

      throw new InternalServerErrorException('Error to update order!');
    }
  }

  private async validateCart(cartId: string) {
    const cart = await this.cartService.getCart(cartId);

    if (cart.cartItem.length === 0) {
      throw new BadRequestException('Cart is empty!');
    }

    return cart;
  }

  private async validateStock(cartItems: CartItem[]) {
    for (const item of cartItems) {
      const product = await this.productService.getById(item.productId);

      if (item.amount > product.amount) {
        throw new BadRequestException('Product Out of Stock!');
      }
    }
  }

  private calculateCartTotal(cartItems: CartItem[]) {
    return cartItems.reduce((sum, item) => {
      return sum.add(new Prisma.Decimal(item.price).mul(item.amount));
    }, new Prisma.Decimal(0));
  }

  private validateOrderNotCanceled(order: Order) {
    if (order.status === OrderStatus.CANCELED) {
      throw new BadRequestException('Order Already Canceled!');
    }
  }

  private restoreProductStock(
    tx: Prisma.TransactionClient,
    orderItems: OrderItem[],
  ) {
    Promise.all(
      orderItems.map(async (item) => {
        await tx.product.update({
          where: { id: item.productId },
          data: { amount: { increment: item.amount } },
        });
      }),
    );
  }
}
