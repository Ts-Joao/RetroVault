import { 
    Injectable,
    NotFoundException,
    BadRequestException
} from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { AddItemDto } from "./dto/add.item.dto";
import { UpdatedItemDto } from "./dto/update.item.dto";

@Injectable()
export class CartService {
    constructor(private readonly db: DatabaseService) {}

    async getOrCreateCart(userId: string) {
        return this.db.cart.upsert({
            where: { userId },
            create: { userId },
            update: {},
            include: {
                cartItem: {
                    include: { product: true },
                }
            }
        });
    }

    async addItem(userId: string, dto: AddItemDto) {
        const cart = await this.getOrCreateCart(userId);
        const product = await this.db.product.findUnique({
            where: { id: dto.productID }
        });

        if (!product) {
            throw new NotFoundException('product not found');
        }

        const existing = await this.db.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    product: dto.productID
                }
            }
        });

        if (existing) {
            return this.db.cartItem.update({
                where: { id: existing.id },
                data: { amount: existing.amount + dto.amount },
                include: { product: true }
            });
        }

        return this.db.cartItem.create({
            data: {
                cartId: cart.id,
                productId: dto.productID,
                amount: dto.amount,
                price: product.price
            },
            include: { product: true }
        });
    }

    async updateItem(userId: string, itemId: string, dto: UpdatedItemDto) {
        const cart = await this.getOrCreateCart(userId);
        
        const item = await this.db.cartItem.findUnique({
            where: { id: itemId, cartId: cart.id}
        });

        if (!item) {
            throw new NotFoundException('Item not found in cart');
        }

        return this.db.cartItem.update({
            where: { id: itemId },
            data: { amount: dto.amount },
            include: { product: true }
        });
    }

    async removeItem(userId: string, itemId: string) {
        const cart = await this.getOrCreateCart(userId);

        const item = await this.db.cartItem.findFirst({
            where: { id: itemId, cartId: cart.id }
        });

        if (!item) {
            throw new NotFoundException('Item not found in cart');
        }

        return this.db.cartItem.delete({ where: { id: itemId }});
    }

    async clearCart(userId: string) {
        const cart = await this.getOrCreateCart(userId);

        await this.db.cartItem.deleteMany({ where: { cartId: cart.id }});
        return { message: 'cart successfully emptied' };
    }

    async getCartTotal(userId: string) {
        const cart = await this.getOrCreateCart(userId);

        const total = cart.cartItem.reduce((sum, item) => {
            return sum + Number(item.price) * item.amount;
        }, 0);

        return {
            cart,
            total: total.toFixed(2),
            itemCount: cart.cartItem.reduce((sum, item) => sum + item.amount, 0),
        };
    }
}
