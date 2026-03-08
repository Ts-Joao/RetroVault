import { AppModule } from '../src/app.module';
import { NestFactory } from '@nestjs/core';
import { PrismaService } from '../src/database/prisma.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get<PrismaService>(PrismaService);

  await prisma.user.upsert({
    where: {
      email: 'admin@retrovault.com',
    },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@retrovault.com',
      password: 'adminpassword',
      role: 'ADMIN',
    },
  });

  await prisma.mediaType.createMany({
    data: [
      { name: 'GAME' },
      {
        name: 'MOVIE',
      },
    ],
    skipDuplicates: true,
  });

  await app.close();
}

void bootstrap();
