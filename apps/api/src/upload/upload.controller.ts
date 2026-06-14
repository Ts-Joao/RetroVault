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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthTokenGuard)
@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: 'Upload profile photo' })
  @ApiBody({ type: 'file' })
  @ApiResponse({
    status: 200,
    description: 'Profile photo uploaded successfully',
  })
  @ApiResponse({ status: 404, description: 'Profile photo not found' })
  @Post('profile')
  @UseInterceptors(ProfilePhotoInterceptor)
  uploadProfile(
    @TokenPayloadParam() payload: PayloadDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadService.uploadProfilePhoto(payload.sub, file);
  }

  @ApiOperation({ summary: 'Get profile photo' })
  @ApiResponse({ status: 200, description: 'Profile photo found successfully' })
  @ApiResponse({ status: 404, description: 'Profile photo not found' })
  @Get('profile')
  getProfilesPhoto(@TokenPayloadParam() payload: PayloadDto) {
    return this.uploadService.getProfilePhoto(payload.sub);
  }

  @ApiOperation({ summary: 'Delete profile photo' })
  @ApiResponse({
    status: 200,
    description: 'Profile photo deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Profile photo not found' })
  @Delete('profile')
  deleteProfilePhoto(@TokenPayloadParam() payload: PayloadDto) {
    return this.uploadService.deleteProfilePhoto(payload.sub);
  }

  @ApiOperation({ summary: 'Upload product photo' })
  @ApiBody({ type: 'file' })
  @ApiResponse({
    status: 200,
    description: 'Product photo uploaded successfully',
  })
  @ApiResponse({ status: 404, description: 'Product photo not found' })
  @Post('products/:productId')
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

  @ApiOperation({ summary: 'Get product photos' })
  @ApiResponse({
    status: 200,
    description: 'Product photos found successfully',
  })
  @ApiResponse({ status: 404, description: 'Product photos not found' })
  @Get('products/:productId')
  getProductPhotos(@Param('productId') productId: string) {
    return this.uploadService.getProductPhoto(productId);
  }

  @ApiOperation({ summary: 'Delete product photo' })
  @ApiResponse({
    status: 200,
    description: 'Product photo deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Product photo not found' })
  @Delete('photo/:photoId')
  deleteProductPhoto(
    @TokenPayloadParam() payload: PayloadDto,
    @Param('photoId') photoId: string,
  ) {
    return this.uploadService.deleteProductPhoto(payload.sub, photoId);
  }
}
