import { AppModule } from '../src/app/app.module';
import { NestFactory } from '@nestjs/core';
import { DatabaseService } from '../src/database/database.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get<DatabaseService>(DatabaseService);

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
