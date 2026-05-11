import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const ProductPhotoInterceptor = FileInterceptor('file', {
    storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, callback) => {
            const extension = extname(file.originalname);
            const uniqueSuffix = `${Date.now()}-${Math.random() * 1e9}`;

            callback(null, `$products-${uniqueSuffix}${extension}`)
        },
    }),
});
