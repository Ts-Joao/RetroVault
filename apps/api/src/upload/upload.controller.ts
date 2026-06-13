import {
    Controller,
    Post,
    Delete,
    Get,
    Param,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
    UseGuards,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { ProfilePhotoInterceptor } from './interceptors/profile-photo.interceptor';
import { ProductPhotoInterceptor } from './interceptors/product-photo.interceptor';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
import { PayloadDto } from 'src/auth/dto/payload.dto';

@Controller('uploads')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post('profile')
    @UseGuards(AuthTokenGuard)
    @UseInterceptors(ProfilePhotoInterceptor)
    uploadProfile(
        @TokenPayloadParam() payload: PayloadDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.uploadService.uploadProfilePhoto(payload.sub, file);
    }

    @Get('profile')
    @UseGuards(AuthTokenGuard)
    getProfilesPhoto(@TokenPayloadParam() payload: PayloadDto) {
        return this.uploadService.getProfilePhoto(payload.sub);
    }

    @Delete('profile')
    @UseGuards(AuthTokenGuard)
    deleteProfilePhoto(@TokenPayloadParam() payload: PayloadDto) {
        return this.uploadService.deleteProfilePhoto(payload.sub);
    }

    @Post('products/:productId')
    @UseGuards(AuthTokenGuard)
    @UseInterceptors(ProductPhotoInterceptor)
    uploadProductPhoto(
        @TokenPayloadParam() payload: PayloadDto,
        @Param('productId') productId: string,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        console.log('userId:', payload.sub);
        console.log('files:', files);
        return this.uploadService.uploadProductPhoto(payload.sub, productId, files);
    }

    @Get('products/:productId')
    getProductPhotos(@Param('productId') productId: string) {
        return this.uploadService.getProductPhoto(productId);
    }

    @Delete('photo/:photoId')
    @UseGuards(AuthTokenGuard)
    deleteProductPhoto(
        @TokenPayloadParam() payload: PayloadDto,
        @Param('photoId') photoId: string,
    ) {
        return this.uploadService.deleteProductPhoto(payload.sub, photoId);
    }
}