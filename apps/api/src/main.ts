import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);  

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))

  app.useStaticAssets(join(__dirname, '..', '..', 'uploads'), {
    prefix: '/uploads/'
  });

  app.enableCors({
    origin: [
      process.env.WEB_URL!,
      process.env.MOBILE_URL!
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })

  app.use(cookieParser());

  const staticPath = join(__dirname, '..', 'uploads');
  console.log('Static path:', staticPath);
  console.log('Exists:', require('fs').existsSync(staticPath));

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
