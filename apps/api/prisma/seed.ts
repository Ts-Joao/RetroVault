import { AppModule } from '../src/app.module';
import { NestFactory } from '@nestjs/core';
import { PrismaService } from '../src/prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get(PrismaService);

  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@retrovault.com',
      password: 'adminpassword',
      role: 'ADMIN',
    },
  });

  await app.close();
}

void bootstrap();
