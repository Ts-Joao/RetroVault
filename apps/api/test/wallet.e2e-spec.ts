import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AppModule } from 'src/app/app.module';

describe('Wallet', () => {
    let app: INestApplication
    let prisma: DatabaseService
    let userId: string

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
            .send({ name: 'wallet-user', email: 'wallet@example.com', password: 'Strong123@' })
            .expect(201)

        userId = userRes.body.newUser.id
    })

    afterAll(async () => {
        await prisma.$executeRawUnsafe('TRUNCATE TABLE "users" CASCADE');
        await prisma.$disconnect();
        await app.close();
    });

    it('/GET wallet - should get user wallet', async () => {
        const response = await request(app.getHttpServer())
            .get('/wallet')
            .send({ userId })
            .expect(200)

        console.log(response.body)
        expect(response.body).toHaveProperty('id')
        expect(response.body.userId).toBe(userId)
    })

    it('/PATCH wallet/deposit - should deposit into wallet', async () => {
        const response = await request(app.getHttpServer())
            .patch('/wallet/deposit')
            .send({ userId, amount: 100.50 })
            .expect(200)

        console.log(response.body)
        expect(Number(response.body.balance)).toBe(100.50)
    })

    it('/PATCH wallet/deposit - should accumulate balance', async () => {
        const response = await request(app.getHttpServer())
            .patch('/wallet/deposit')
            .send({ userId, amount: 50.00 })
            .expect(200)

        expect(Number(response.body.balance)).toBe(150.50)
    })

    it('/GET wallet/statement - should get transaction history', async () => {
        const response = await request(app.getHttpServer())
            .get('/wallet/statement')
            .send({ userId })
            .expect(200)

        console.log(response.body)
        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBe(2)
    })

    it('/GET wallet - should fail with non-existent user', async () => {
        await request(app.getHttpServer())
            .get('/wallet')
            .send({ userId: '00000000-0000-0000-0000-000000000000' })
            .expect(404)
    })
})
