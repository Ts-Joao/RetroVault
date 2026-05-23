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

@Controller('uploads')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post('profile')
    @UseInterceptors(ProfilePhotoInterceptor)
    uploadProfile(
        @Headers('user-id') userId: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.uploadService.uploadProfilePhoto(userId, file);
    }

    @Get('profile')
    getProfilesPhoto(@Headers('user-id') userId: string) {
        return this.uploadService.getProfilePhoto(userId);
    }

    @Delete('profile')
    deleteProfilePhoto(@Headers('user-id') userId: string) {
        return this.uploadService.deleteProfilePhoto(userId);
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
