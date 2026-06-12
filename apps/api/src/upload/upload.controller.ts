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
import { UploadedFiles } from '@nestjs/common';

@Controller('uploads')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post('profile')
    @UseInterceptors(ProfilePhotoInterceptor)
    uploadProfile(
        @Headers('user-id') userId: string,
        @UploadedFile() files: Express.Multer.File,
    ) {
        return this.uploadService.uploadProfilePhoto(userId, files);
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
    @UploadedFiles() files: Express.Multer.File[],
) {
    console.log(files);

    return this.uploadService.uploadProductPhoto(
        userId,
        productId,
        files,
    );
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
