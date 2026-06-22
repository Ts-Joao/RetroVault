import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

export const ProfilePhotoInterceptor = FileInterceptor('file', {
  storage: diskStorage({
    destination: (req, file, callback) => {
      // Caminho seguro que garante a persistência na pasta uploads da raiz
      const uploadPath = join(process.cwd(), 'uploads', 'profiles');
      callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `profile-${uniqueSuffix}${ext}`);
    },
  }),
});