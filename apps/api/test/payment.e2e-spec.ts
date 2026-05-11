import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AppModule } from 'src/app/app.module';

describe('Payment', () => {
    let app: INestApplication
    let prisma: DatabaseService
    let userId: string
    let accessToken: string
    let orderId: string
    let paymentToken: string

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        prisma = moduleRef.get<DatabaseService>(DatabaseService);
        await app.init();

        // Clean up
        await prisma.$executeRawUnsafe('TRUNCATE TABLE "users" CASCADE');
        await prisma.$executeRawUnsafe('TRUNCATE TABLE "products" CASCADE');
        await prisma.$executeRawUnsafe('TRUNCATE TABLE "orders" CASCADE');

        await prisma.mediaType.createMany({
            data: [{ name: 'GAME' }, { name: 'MOVIE' }],
            skipDuplicates: true,
        });

        // Create buyer
        const buyerRes = await request(app.getHttpServer())
            .post('/users')
            .send({ name: 'pay-buyer', email: 'pay-buyer@example.com', password: 'Strong123@' })
            .expect(201)
        userId = buyerRes.body.newUser.id

        // Login
        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'pay-buyer@example.com', password: 'Strong123@' })
            .expect(201)
        accessToken = loginRes.body.acess_token

        // Create seller
        const sellerRes = await request(app.getHttpServer())
            .post('/users')
            .send({ name: 'pay-seller', email: 'pay-seller@example.com', password: 'Strong123@' })
            .expect(201)
        const sellerId = sellerRes.body.newUser.id

        await prisma.user.update({
            where: { id: sellerId },
            data: { role: 'SELLER' }
        })

        // Create product
        const mediaType = await prisma.mediaType.findFirst({ where: { name: 'GAME' } });
        const productRes = await request(app.getHttpServer())
            .post('/products')
            .set('user-id', sellerId)
            .send({
                name: 'Payment Test Product',
                price: 19.99,
                description: 'For payment tests',
                amount: 30,
                mediaTypeId: mediaType!.id
            })
            .expect(201)

        // Add to cart
        await request(app.getHttpServer())
            .post('/cart')
            .set('user-id', userId)
            .send({ productId: productRes.body.id, amount: 1 })
            .expect(201)

        // Checkout with PIX
        const orderRes = await request(app.getHttpServer())
            .post('/orders')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ address: 'Rua Payment, 456', paymentMethod: 'PIX' })
            .expect(201)
        orderId = orderRes.body.id
    })

    afterAll(async () => {
        await prisma.$executeRawUnsafe('TRUNCATE TABLE "users" CASCADE');
        await prisma.$executeRawUnsafe('TRUNCATE TABLE "products" CASCADE');
        await prisma.$executeRawUnsafe('TRUNCATE TABLE "orders" CASCADE');
        await prisma.$disconnect();
        await app.close();
    });

    it('/POST payment/simulation/:orderId - should generate payment token', async () => {
        const response = await request(app.getHttpServer())
            .post(`/payment/simulation/${orderId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(201)

        paymentToken = response.text.replace(/"/g, '')

        console.log('Payment token:', paymentToken)
        expect(paymentToken).toBeDefined()
        expect(paymentToken.length).toBeGreaterThan(0)
    })

    it('/PATCH payment/confirmation/:token - should confirm payment', async () => {
        const response = await request(app.getHttpServer())
            .patch(`/payment/confirmation/${paymentToken}`)
            .expect(200)

        console.log(response.text)
        expect(response.text).toContain('Payment confirmed successfully')
    })

    it('/PATCH payment/confirmation/:token - should fail with invalid token', async () => {
        await request(app.getHttpServer())
            .patch('/payment/confirmation/invalid-token-12345')
            .expect(404)
    })

    it('/POST payment/simulation - should fail without auth', async () => {
        await request(app.getHttpServer())
            .post(`/payment/simulation/${orderId}`)
            .expect(401)
    })
})
