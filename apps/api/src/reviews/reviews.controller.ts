import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Headers,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('products/:productId')
  getProductReviews(@Param('productId') productId: string) {
    return this.reviewsService.getProductReviews(productId);
  }

  @Get('products/:product/me')
  getUserReview(
    @Headers('user-id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.reviewsService.getUserReview(userId, productId);
  }

  @Post('products/:productId')
  createReview(
    @Headers('user-id') userId: string,
    @Param('productId') productId: string,
    @Body() dto: CreateReviewDto
  ) {
    return this.reviewsService.createReview(userId, productId, dto);
  }

  @Patch('products/:productId')
  updateReview(
    @Headers('user-id') userId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.updateReview(userId, productId, dto);
  }

  @Delete('products/:productId')
  deleteReview(
    @Headers('user-id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.reviewsService.deleteReview(userId, productId);
  }
}
