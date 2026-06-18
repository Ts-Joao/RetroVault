import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/add.item.dto';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UpdatedItemDto } from './dto/update.item.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';

@Controller('cart')
@ApiBearerAuth()
@UseGuards(AuthTokenGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Get cart' })
  @ApiResponse({ status: 200, description: 'Cart found successfully' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @Get()
  getCart(@TokenPayloadParam() user: PayloadDto) {
    return this.cartService.getCartTotal(user);
  }

  @ApiOperation({ summary: 'Add item to cart' })
  @ApiBody({ type: AddItemDto })
  @ApiResponse({ status: 200, description: 'Item added successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @Post()
  addItem(@Body() dto: AddItemDto, @CurrentUser() user: PayloadDto) {
    return this.cartService.addItem(user.sub, dto);
  }

  @ApiOperation({ summary: 'Update item in cart' })
  @ApiBody({ type: UpdatedItemDto })
  @ApiResponse({ status: 200, description: 'Item updated successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @Patch(':cartItemId')
  updateItem(
    @Param('cartItemId') cartItemId: string,
    @Body() dto: { amount: number },
    @CurrentUser() user: PayloadDto,
  ) {
    return this.cartService.updateItemAmount(user.sub, cartItemId, dto.amount);
  }

  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @Delete(':cartId')
  removeItem(
    @Param('cartId') cartId: string,
    @Body() itemId: { id: string },
    @TokenPayloadParam() user: PayloadDto,
  ) {
    return this.cartService.removeItem(user.sub, cartId, itemId.id);
  }

  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @Delete('clear/:cartId')
  clearCart(
    @Param('cartId') cartId: string,
    @TokenPayloadParam() user: PayloadDto,
  ) {
    return this.cartService.clearCart(user, cartId);
  }
}
