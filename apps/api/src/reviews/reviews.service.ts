import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly db: DatabaseService) {}

  private findReview(userId: string, productId: string) {
    return this.db.review.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });
  }

  private async updateProductRating(productId: string) {
    const result = await this.db.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const avg = result._avg.rating ?? 0;

    await this.db.product.update({
      where: { id: productId },
      data: { rating: avg },
    });
  }

  async userBoughtProduct(userId: string, productId: string) {
    const orderItem = await this.db.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] },
        },
      },
    });

    return !!orderItem;
  }

  async getProductReviews(productId: string) {
    const product = await this.db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.db.review.findMany({
      where: { productId },
      include: {
        user: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserReview(userId: string, productId: string) {
    const review = await this.findReview(userId, productId);

    if (!review) {
      throw new NotFoundException('Assessment not found');
    }

    return review;
  }

  async createReview(userId: string, productId: string, dto: CreateReviewDto) {
    const product = await this.db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const bought = await this.userBoughtProduct(userId, productId);

    if (!bought) {
      throw new ForbiddenException(
        'You can only rate products you have purchased',
      );
    }

    const existing = await this.findReview(userId, productId);

    if (existing) {
      throw new ConflictException(
        'Have you already rated this product'
      )
    }

    const review = await this.db.review.create({
      data: {
        userId,
        productId,
        rating: dto.rating,
      },
      include: {
        user: {
          select: { id: true, name: true, slug: true }
        }
      }
    });

    await this.updateProductRating(productId);

    return review;
  }

  async updateReview(userId: string, productId: string, dto: UpdateReviewDto) {
    const review = await this.findReview(userId, productId);

    if (!review) {
      throw new NotFoundException(
        'Assessment not foud'
      );
    }

    const updated = await this.db.review.update({
      where: {
        userId_productId: { userId, productId },
      },
      data: { rating: dto.rating },
      include: {
        user: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    await this.updateProductRating(productId);

    return updated;
  }

  async deleteReview(userId: string, productId: string) {
    const review = await this.findReview(userId, productId);

    if (!review) {
      throw new NotFoundException(
        'Assessment not found'
      );
    }

    await this.db.review.delete({
      where: {
        userId_productId: { userId, productId },
      },
    });

    await this.updateProductRating(productId);

    return { message: 'Review successfully removed' };
  }
}
