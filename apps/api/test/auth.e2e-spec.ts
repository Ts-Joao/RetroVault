import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AppModule } from 'src/app/app.module';

describe('Auth', () => {
  let app: INestApplication;
  let prisma: DatabaseService;
  let accessToken: string;
  let userId: string;
  let userData: any;

  userData = {
    name: 'auth-test-user',
    email: 'auth@example.com',
    password: 'Strong123@',
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get<DatabaseService>(DatabaseService);

    await app.init();
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "users" CASCADE');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "wallets" CASCADE');

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(userData)
      .expect(201);

    console.log('Response', response.body);
    console.log('Id', response.body.newUser.id);
    userId = response.body.newUser.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('/POST auth/login - should login successfully', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect(201);

    console.log(response.body);
    expect(response.body).toHaveProperty('accessToken');

    console.log('Access Token', response.body.accessToken);
    accessToken = response.body.accessToken;
  });

  it('/POST auth/login - should fail with wrong password', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: userData.email,
        password: 'WrongPass123@',
      })
      .expect(401);
  });

  it('/POST auth/logout - should logout successfully', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);

    console.log(response.body);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Logged out successfully!');
  });

  it('/POST auth/logout - should fail without token', async () => {
    await request(app.getHttpServer()).post('/auth/logout').expect(401);
  });
});