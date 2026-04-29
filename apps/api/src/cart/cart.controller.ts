import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/add.item.dto';
import { UpdatedItemDto } from './dto/update.item.dto';

@Controller('cart')
// @UseGuards
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    getCart(@Req() req: any) {
        const userId = req.user?.id ?? 'user-placeholder';
        return this.cartService.getCartTotal(userId);
    }

    @Post()
    addItem(@Req() req: any, @Body() dto: AddItemDto) {
        const userId = req.user?.id ?? 'user-placeholder';
        return this.cartService.addItem(userId, dto);
    }

    @Patch(':id')
    updateItem(
        @Req() req: any,
        @Param('id') id: string,
        @Body() dto: UpdatedItemDto,
    ) {
        const userId = req.user?.id ?? 'user-placeholder';
        return this.cartService.updateItem(userId, id, dto);
    }

    @Delete(':id')
    removeitem(@Req() req: any, @Param('id') id: string) {
        const userId = req.user?.id ?? 'user-placeholder';
        return this.cartService.removeItem(userId, id);
    }

    @Delete()
    clearCart(@Req() req: any) {
        const userId = req.user?.id ?? 'user-placeholder';
        return this.cartService.clearCart(userId);
    }
}
