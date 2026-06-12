
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FilesInterceptor } from '@nestjs/platform-express';

export const ProductPhotoInterceptor = FilesInterceptor(
  'files',
  3,
  {
    storage: diskStorage({
      destination: './uploads/products',
      filename: (req, file, cb) => {
        const extension = extname(file.originalname);
        const uniqueSuffix =
          `${Date.now()}-${Math.random() * 1e9}`;

            cb(null, `products-${uniqueSuffix}${extension}`)
        },
    }),
  },
);