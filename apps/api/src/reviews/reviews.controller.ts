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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({ summary: 'Get product reviews' })
  @ApiResponse({ status: 200, description: 'Product reviews retrieved successfully' })
  @Get('products/:productId')
  getProductReviews(@Param('productId') productId: string) {
    return this.reviewsService.getProductReviews(productId);
  }

  @ApiOperation({ summary: 'Get user bought product' })
  @ApiResponse({ status: 200, description: 'User bought product retrieved successfully' })
  @Get('products/:productId/bought')
  userBoughtProduct(
    @Headers('user-id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.reviewsService.userBoughtProduct(userId, productId);
  }

  @ApiOperation({ summary: 'Get user review' })
  @ApiResponse({ status: 200, description: 'User review retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User review not found' })
  @Get('products/:productId/me')
  getUserReview(
    @Headers('user-id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.reviewsService.getUserReview(userId, productId);
  }

  @ApiOperation({ summary: 'Create review' })
  @ApiResponse({ status: 200, description: 'Review created successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @Post('products/:productId')
  createReview(
    @Headers('user-id') userId: string,
    @Param('productId') productId: string,
    @Body() dto: CreateReviewDto
  ) {
    return this.reviewsService.createReview(userId, productId, dto);
  }

  @ApiOperation({ summary: 'Update review' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @Patch('products/:productId')
  updateReview(
    @Headers('user-id') userId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.updateReview(userId, productId, dto);
  }

  @ApiOperation({ summary: 'Delete review' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @Delete('products/:productId')
  deleteReview(
    @Headers('user-id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.reviewsService.deleteReview(userId, productId);
  }
}
