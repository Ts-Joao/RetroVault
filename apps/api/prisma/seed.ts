import { DatabaseService } from '../src/database/database.service';

async function bootstrap() {
  const prisma = new DatabaseService();
  await prisma.onModuleInit();

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

  await prisma.$disconnect();
}

void bootstrap();
