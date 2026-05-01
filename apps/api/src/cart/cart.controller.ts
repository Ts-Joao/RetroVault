import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Headers,
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
    constructor(private readonly cartService: CartService) { }

    @Get()
    getCart(@Headers('user-id') userId: string) {
        return this.cartService.getCartTotal(userId);
    }

    @Post()
    addItem(@Headers('user-id') userId: string, @Body() dto: AddItemDto) {
        return this.cartService.addItem(userId, dto);
    }

    @Patch(':id')
    updateItem(
        @Headers('user-id') userId: string,
        @Param('id') id: string,
        @Body() dto: UpdatedItemDto,
    ) {
        return this.cartService.updateItem(userId, id, dto);
    }

    @Delete(':id')
    removeItem(@Headers('user-id') userId: string, @Param('id') id: string) {
        return this.cartService.removeItem(userId, id);
    }

    @Delete()
    clearCart(@Headers('user-id') userId: string) {
        return this.cartService.clearCart(userId);
    }
}
