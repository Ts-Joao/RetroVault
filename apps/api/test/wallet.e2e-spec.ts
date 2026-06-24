import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AppModule } from 'src/app/app.module';

describe('Wallet', () => {
  let app: INestApplication;
  let prisma: DatabaseService;
  let userId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get<DatabaseService>(DatabaseService);

    await app.init();

    await prisma.$executeRawUnsafe('TRUNCATE TABLE "users" CASCADE');

    const userRes = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'wallet-user',
        email: 'wallet@example.com',
        password: 'Strong123@',
        phone: '35191894822'
      })
      .expect(201);

    userId = userRes.body.newUser.id;
  });

  afterAll(async () => {
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "users" CASCADE');
    await prisma.$disconnect();
    await app.close();
  });

  it('/GET wallet - should get user wallet', async () => {
    const response = await request(app.getHttpServer())
      .get('/wallet')
      .set('user-id', userId)
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.userId).toBe(userId);
    expect(Number(response.body.balance)).toBe(0);
  });

  it('/POST wallet/deposit - should create deposit request', async () => {
    const response = await request(app.getHttpServer())
      .post('/wallet/deposit')
      .set('user-id', userId)
      .send({
        amount: 100.5,
        type: 'DEPOSIT',
        paymentMethod: 'PIX',
      });

    expect([200, 201]).toContain(response.status);
  });

  it('/POST wallet/deposit - should create second deposit request', async () => {
    const response = await request(app.getHttpServer())
      .post('/wallet/deposit')
      .set('user-id', userId)
      .send({
        amount: 50,
        type: 'DEPOSIT',
        paymentMethod: 'PIX',
      });

    expect([200, 201]).toContain(response.status);
  });

  it('/GET wallet/statement - should get transaction history', async () => {
    const response = await request(app.getHttpServer())
      .get('/wallet/statement')
      .set('user-id', userId)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  it('/GET wallet - should fail with non-existent user', async () => {
    await request(app.getHttpServer())
      .get('/wallet')
      .set('user-id', '00000000-0000-0000-0000-000000000000')
      .expect(404);
  });
});