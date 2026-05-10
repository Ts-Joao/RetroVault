import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { validateImageFile } from './validators/file.validator';

@Injectable()
export class UploadService {
    constructor(private readonly db: DatabaseService) {}

    async uploadProfilePhoto(userId: string, file: Express.Multer.File) {
        validateImageFile(file);
        const url = `./uploads/profiles/${file.filename}`;

        return this.db.profilePhoto.upsert({
            where: { userId },
            create: { userId, url},
            update: { url },
        });
    }

    async uploadProductPhoto(
        userId: string,
        productId: string,
        file: Express.Multer.File
    ) {
        validateImageFile(file);

        const product = await this.db.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException('product not found');
        }

        if (product.sellerId !== userId) {
            throw new ForbiddenException(
                'You dont have permission to add a photo to this product',
            );
        }

        const url = `./uploads/products/${file.filename}`;

        return this.db.productPhoto.create({
            data: { productId, url },
        });
    }

    async deleteProductPhoto(userId: string, photoId: string) {
        const photo = await this.db.productPhoto.findUnique({
            where: { id: photoId },
            include: { product: true },
        });

        if (!photo) {
            throw new NotFoundException('photo not found');
        }

        if(photo.product.sellerId !== userId) {
            throw new ForbiddenException(
                'You dont have permission to remove this photo',
            );
        }

        return this.db.productPhoto.delete({ where: { id: photoId } });
    }

    async getProductPhoto(productId: string) {
        return this.db.productPhoto.findMany({
            where: { productId },
        });
    }
}
