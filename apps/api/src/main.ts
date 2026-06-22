import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const profileDir = join(process.cwd(), 'uploads', 'profiles');
  const productDir = join(process.cwd(), 'uploads', 'products');
  if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });
  if (!fs.existsSync(productDir)) fs.mkdirSync(productDir, { recursive: true });

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  const config = new DocumentBuilder()
    .setTitle('Retro Vault API')
    .setDescription('API Documentation for Retro Vault')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.enableCors({
    origin: [
      process.env.WEB_URL ?? 'http://localhost:3000',
      'http://127.0.0.1:3000',
      process.env.MOBILE_URL ?? 'http://localhost:8081',
      'http://127.0.0.1:8081',
      process.env.ADMIN_URL ?? 'http://localhost:5000',
      'http://127.0.0.1:5000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'user-id',
    ],
  });

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
