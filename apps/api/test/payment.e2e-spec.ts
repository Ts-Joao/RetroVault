import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app/app.module';
import { DatabaseService } from 'src/database/database.service';

describe('Payment', () => {
  let app: INestApplication;
  let prisma: DatabaseService;

  let userId: string;
  let accessToken: string;
  let orderId: string;
  let paymentToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(DatabaseService);

    await app.init();

    await prisma.$executeRawUnsafe('TRUNCATE TABLE "users" CASCADE');

    const user = await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'payment-user',
        email: 'payment@test.com',
        password: 'Strong123@',
        phone: '35191894822'
      })
      .expect(201);

    userId = user.body.newUser.id;

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'payment@test.com',
        password: 'Strong123@',
      })
      .expect(201);

    accessToken = login.body.accessToken;

    const order = await prisma.order.create({
      data: {
        userId,
        address: 'Rua Teste',
        totalAmount: 100,
        status: 'PENDING',
        payment: {
          create: {
            paymentMethod: 'PIX',
            status: 'PENDING',
            installments: 1,
          },
        },
      },
      include: {
        payment: true,
      },
    });

    orderId = order.id;
  });

  afterAll(async () => {
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "users" CASCADE');
    await prisma.$disconnect();
    await app.close();
  });

  it('/POST payment/simulation/:orderId', async () => {
    const response = await request(app.getHttpServer())
      .post(`/payment/simulation/${orderId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect([200, 201]).toContain(response.status);

    paymentToken =
      typeof response.body === 'string'
        ? response.body
        : response.body.token ||
          response.body.confirmationCode ||
          response.text.replace(/"/g, '');

    expect(paymentToken).toBeDefined();
  });

  it('/PATCH payment/confirmation/:token', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/payment/confirmation/${paymentToken}`);

    expect([200, 201]).toContain(response.status);
  });

  it('/PATCH payment/confirmation/:token - invalid token', async () => {
    await request(app.getHttpServer())
      .patch('/payment/confirmation/invalid-token')
      .expect(404);
  });

  it('/POST payment/simulation/:orderId - unauthorized', async () => {
    await request(app.getHttpServer())
      .post(`/payment/simulation/${orderId}`)
      .expect(401);
  });
});