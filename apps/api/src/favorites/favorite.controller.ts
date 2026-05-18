import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Headers,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { Product } from 'src/products/entities/product.entity';

@Controller('favorites')
export class FavoriteController {
    constructor(private readonly favoriteService: FavoriteService) {}

    @Get()
    getFavorites(@Headers('user-id') userId: string) {
        return this.favoriteService.getFavorites(userId);
    }

    @Get(':productId')
    isFavorited(
        @Headers('user-id') userId: string,
        @Param('productId') productId: string
    ) {
        return this.favoriteService.isFavorited(userId, productId);
    }

    @Post(':productId')
    addFavorite(
        @Headers('user-id') userId: string,
        @Param('productId') productId: string,
    ) {
        return this.favoriteService.addFavorite(userId, productId);
    }

    @Delete(':productId')
    deleteFavorite(
        @Headers('user-id') userId: string,
        @Param('productId') productId: string,
    ) {
        return this.favoriteService.deleteFavorite(userId, productId)
    }
}