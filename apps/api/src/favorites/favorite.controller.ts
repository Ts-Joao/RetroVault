import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Headers,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('favorites')
export class FavoriteController {
    constructor(private readonly favoriteService: FavoriteService) {}

    @ApiOperation({summary:'get all favorites'})
    @ApiResponse({status:200,description:'Favorites found successfully'})
    @ApiResponse({status:404,description:'Favorites not found'})
    @Get()
    getFavorites(@Headers('user-id') userId: string) {
        return this.favoriteService.getFavorites(userId);
    }

    @ApiOperation({summary:'check if product is favorited'})
    @ApiResponse({status:200,description:'Product favorited successfully'})
    @ApiResponse({status:404,description:'Product not found'})
    @Get(':productId')
    isFavorited(
        @Headers('user-id') userId: string,
        @Param('productId') productId: string
    ) {
        return this.favoriteService.isFavorited(userId, productId);
    }

    @ApiOperation({summary:'add favorite product'})
    @ApiResponse({status:200,description:'Product added successfully'})
    @ApiResponse({status:404,description:'Product not found'})
    @Post(':productId')
    addFavorite(
        @Headers('user-id') userId: string,
        @Param('productId') productId: string,
    ) {
        return this.favoriteService.addFavorite(userId, productId);
    }

    @ApiOperation({summary:'delete favorite product'})
    @ApiResponse({status:200,description:'Product deleted successfully'})
    @ApiResponse({status:404,description:'Product not found'})
    @Delete(':productId')
    deleteFavorite(
        @Headers('user-id') userId: string,
        @Param('productId') productId: string,
    ) {
        return this.favoriteService.deleteFavorite(userId, productId)
    }
}