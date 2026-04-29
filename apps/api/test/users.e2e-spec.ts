import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AppModule } from 'src/app/app.module';

describe('Users', () => {
    let app: INestApplication
    let prisma: DatabaseService
    let userId: string
    let accessToken: string

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

        app = moduleRef.createNestApplication();
        prisma = moduleRef.get<DatabaseService>(DatabaseService);
        console.log('TEST DB:', process.env.DATABASE_URL)
    
        await app.init();
        await prisma.user.deleteMany();
    })

    afterAll(async () => {
        await prisma.user.deleteMany();
        await prisma.$disconnect();
        await app.close();
    });

    it('/POST', async () => {
        const userData = {
            name: 'joao-ts',
            email: 'teixeira@example.com',
            password: 'Strong123@'
        }
        const response = await request(app.getHttpServer())
            .post('/users')
            .send(userData)
            .expect(201)

        userId = response.body.id

        console.log(response.body);
        expect(response.body.email).toBe(userData.email)
        expect(response.body).toHaveProperty('id')
    })

    it('/AUTH/LOGIN', async () => {
        const userData = {
            email: 'teixeira@example.com',
            password: 'Strong123@'
        }
        
        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send(userData)
            .expect(201)

        accessToken = response.body.refresh_token

        return response
    })

    it('/GET', async () => {
        const response = await request(app.getHttpServer())
            .get('/users')
            .expect(200)

        console.log(response.body)
        expect(response.body).toBeInstanceOf(Array)
    })

    it('/GET by ID', async () => {
        const response = await request(app.getHttpServer())
            .get(`/users/${userId}`)
            .expect(200)

        console.log(response.body)
        expect(response.body.id).toBe(userId)
    })

    it('/PATCH', async () => {
        const userData = {
            name: 'Ts-João',
            email: 'teixeira.simoes@gmail.com',
            password: 'gnortS321!'
        }
        
        const response = await request(app.getHttpServer())
            .patch(`/users/${userId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(userData)
            .expect(200)

        console.log(response.body)
        expect(response.body.name).toBe('Ts-João')
    })

    it('/DELETE', async () => {
        const response = await request(app.getHttpServer())
            .delete(`/users/${userId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)

        console.log(response.body)
        expect(response.body.id).toBe(userId)
    })
})