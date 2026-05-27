import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FavoriteService {
  constructor(private readonly db: DatabaseService) {}

  private findFavorite(userId: string, productId: string) {
    return this.db.favorite.findUnique({
      where: {
        userId_productId: { userId, productId}
      }
    })
  }

  async getFavorites(userId: string) {
    return this.db.favorite.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            photos: true,
            mediaType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async isFavorited(userId: string, productId: string) {
    const favorite = await this.findFavorite(userId, productId);
    return { isFavorited: !!favorite };
  }

  async addFavorite(userId: string, productId: string) {
    const product = await this.db.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) throw new NotFoundException('Product not found');

    const existing = await this.findFavorite(userId, productId)

    if (existing) {
      throw new ConflictException('Product is already in favorites');
    }

    return this.db.favorite.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: {
          include: { photos: true },
        },
      },
    });
  }

  async deleteFavorite(userId: string, productId: string) {
    const favorite = await this.findFavorite(userId, productId)

    if (!favorite) {
      throw new NotFoundException('favorite not found');
    }

    await this.db.favorite.delete({
      where: {
        userId_productId: { userId, productId },
      }
    });

    return { message: 'favorite deleted sucessfully' };
  }
}
