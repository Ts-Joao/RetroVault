import { BadRequestException } from '@nestjs/common';

export function validateImageFile(file: Express.Multer.File) {
    if (!file) {
        throw new BadRequestException('no file sent');
    }

    const allowMimeType = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowMimeType.includes(file.mimetype)) {
        throw new BadRequestException(
            'invalid file type. Only jpeg, png and webp are allowed.'
        );
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
        throw new BadRequestException(
            'file muito large. Maximum allowed 5MB'
        );
    }
}