import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    UseGuards,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse
} from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { PayloadDto } from 'src/auth/dto/payload.dto';

@Controller('favorites')
@ApiBearerAuth()
@UseGuards(AuthTokenGuard)
export class FavoriteController {
    constructor(private readonly favoriteService: FavoriteService) {}

    @ApiOperation({summary:'get all favorites'})
    @ApiResponse({status:200,description:'Favorites found successfully'})
    @ApiResponse({status:404,description:'Favorites not found'})
    @Get()
    getFavorites(@CurrentUser() user: PayloadDto) {
        return this.favoriteService.getFavorites(user.sub);
    }

    @ApiOperation({summary:'check if product is favorited'})
    @ApiResponse({status:200,description:'Product favorited successfully'})
    @ApiResponse({status:404,description:'Product not found'})
    @Get(':productId')
    isFavorited(
        @Param('productId') productId: string,
        @CurrentUser() user: PayloadDto,
    ) {
        return this.favoriteService.isFavorited(user.sub, productId);
    }

    @ApiOperation({summary:'add favorite product'})
    @ApiResponse({status:200,description:'Product added successfully'})
    @ApiResponse({status:404,description:'Product not found'})
    @Post(':productId')
    addFavorite(
        @Param('productId') productId: string,
        @CurrentUser() user: PayloadDto,
    ) {
        return this.favoriteService.addFavorite(user.sub, productId);
    }

    @ApiOperation({summary:'delete favorite product'})
    @ApiResponse({status:200,description:'Product deleted successfully'})
    @ApiResponse({status:404,description:'Product not found'})
    @Delete(':productId')
    deleteFavorite(
        @Param('productId') productId: string,
        @CurrentUser() user: PayloadDto,
    ) {
        return this.favoriteService.deleteFavorite(user.sub, productId)
    }
}