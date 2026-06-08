import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    UseGuards,
    ParseUUIDPipe,
    Patch,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/add.item.dto';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';

@Controller('cart')
@UseGuards(AuthTokenGuard)
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    getCart(@TokenPayloadParam() user: PayloadDto) {
        return this.cartService.getCartTotal(user);
    }

    @Post()
    addItem(
        @Body() dto: AddItemDto,
        @TokenPayloadParam() user: PayloadDto
    ) {
        return this.cartService.addItem(user.sub, dto);
    }

    @Patch(':cartItemId')
    updateItem(
        @Param('cartItemId') cartItemId: string,
        @Body() dto: { amount: number },
        @TokenPayloadParam() user: PayloadDto
    ) {
        return this.cartService.updateItemAmount(user.sub, cartItemId, dto.amount);
    }

    @Delete(':cartId')
    removeItem(
        @Param('cartId') cartId: string,
        @Body() itemId: {id: string},
        @TokenPayloadParam() user: PayloadDto
    ) {
        return this.cartService.removeItem(user.sub, cartId, itemId.id);
    }

    @Delete('clear/:cartId')
    clearCart(
        @Param('cartId') cartId: string,
        @TokenPayloadParam() user: PayloadDto,
    ) {
        return this.cartService.clearCart(user, cartId);
    }
}
