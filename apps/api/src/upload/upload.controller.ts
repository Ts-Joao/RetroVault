import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { ProfilePhotoInterceptor } from './interceptors/profile-photo.interceptor';
import { ProductPhotoInterceptor } from './interceptors/product-photo.interceptor';
import { Product } from 'src/products/entities/product.entity';

@Controller('uploads')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post('profile')
    @UseInterceptors(ProfilePhotoInterceptor)
    uploadProfile(
        @Headers('user-id') userId: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.uploadService.uploadProfilePhoto(userId, file);
    }

    @Post('products/:productId')
    @UseInterceptors(ProductPhotoInterceptor)
    uploadProductphoto(
        @Headers('user-id') userId: string,
        @Param('productId') productId: string,
        @UploadedFile() file: Express.Multer.File
    ) {
        return this.uploadService.uploadProductPhoto(userId, productId, file)
    }

    @Get('products/:productId')
    getProductPhotos(@Param('productId') productId: string) {
        return this.uploadService.getProductPhoto(productId);
    }

    @Delete('photo/:photoId')
    deleteProductPhoto(
        @Headers('user-id') userId: string,
        @Param('photoId') photoId: string,
    ) {
        return this.uploadService.deleteProductPhoto(userId, photoId);
    }
} 
