import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AppModule } from 'src/app/app.module';

describe('Auth', () => {
    let app: INestApplication
    let prisma: DatabaseService
    let accessToken: string

    const userData = {
        name: 'auth-test-user',
        email: 'auth@example.com',
        password: 'Strong123@'
    }

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        prisma = moduleRef.get<DatabaseService>(DatabaseService);

        await app.init();
        await prisma.$executeRawUnsafe('TRUNCATE TABLE "users" CASCADE');

        // Create a user for auth tests
        await request(app.getHttpServer())
            .post('/users')
            .send(userData)
            .expect(201)
    })

    afterAll(async () => {
        await prisma.$executeRawUnsafe('TRUNCATE TABLE "users" CASCADE');
        await prisma.$disconnect();
        await app.close();
    });

    it('/POST auth/login - should login successfully', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: userData.email,
                password: userData.password
            })
            .expect(201)

        console.log(response.body)
        expect(response.body).toHaveProperty('acess_token')
        expect(response.body).toHaveProperty('refresh_token')

        accessToken = response.body.acess_token
    })

    it('/POST auth/login - should fail with wrong password', async () => {
        await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: userData.email,
                password: 'WrongPass123@'
            })
            .expect(401)
    })

    it('/POST auth/login - should fail with non-existent email', async () => {
        await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'Strong123@'
            })
            .expect(500)
    })

    it('/POST auth/logout - should logout successfully', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/logout')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(201)

        console.log(response.body)
        expect(response.body).toHaveProperty('id')
        expect(response.body.refreshToken).toBeNull()
    })

    it('/POST auth/logout - should fail without token', async () => {
        await request(app.getHttpServer())
            .post('/auth/logout')
            .expect(401)
    })
})
