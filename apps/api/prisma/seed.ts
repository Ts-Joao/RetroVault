<<<<<<< HEAD
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function bootstrap() {
  const hashedPassword = await bcrypt.hash('Admin@123456', 12);
=======
import { DatabaseService } from '../src/database/database.service';

async function bootstrap() {
  const prisma = new DatabaseService();
  await prisma.onModuleInit();
>>>>>>> origin/develop

  await prisma.user.upsert({
    where: { email: 'admin@retrovault.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@retrovault.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  await prisma.mediaType.createMany({
    data: [{ name: 'GAME' }, { name: 'MOVIE' }],
    skipDuplicates: true,
  });

  await prisma.$disconnect();
<<<<<<< HEAD
  await pool.end();
=======
>>>>>>> origin/develop
}

void bootstrap();