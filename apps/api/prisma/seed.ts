import { AppModule } from '../src/app/app.module';
import { NestFactory } from '@nestjs/core';
import { DatabaseService } from '../src/database/database.service';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prisma = app.get<DatabaseService>(DatabaseService);

  const hashePassword = await bcrypt.hash('adminpassword', 12)

  await prisma.user.upsert({
    where: {
      email: 'admin@retrovault.com',
    },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@retrovault.com',
      password: hashePassword,
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
