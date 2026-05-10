import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AppModule } from 'src/app/app.module';

describe('Orders', () => {
    let app: INestApplication
    let prisma: DatabaseService
    let userId: string
    let sellerId: string
    let accessToken: string
    let orderId: string
    let productId: string

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

        await prisma.mediaType.createMany({
            data: [{ name: 'GAME' }, { name: 'MOVIE' }],
            skipDuplicates: true,
        });

        // Create buyer user
        const buyerRes = await request(app.getHttpServer())
            .post('/users')
            .send({ name: 'order-buyer', email: 'order-buyer@example.com', password: 'Strong123@' })
            .expect(201)
        userId = buyerRes.body.newUser.id

        // Login to get access token
        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'order-buyer@example.com', password: 'Strong123@' })
            .expect(201)
        accessToken = loginRes.body.acess_token

        // Create seller
        const sellerRes = await request(app.getHttpServer())
            .post('/users')
            .send({ name: 'order-seller', email: 'order-seller@example.com', password: 'Strong123@' })
            .expect(201)
        sellerId = sellerRes.body.newUser.id

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
                name: 'Order Test Product',
                price: 29.99,
                description: 'Product for order tests',
                amount: 50,
                mediaTypeId: mediaType!.id
            })
            .expect(201)
        productId = productRes.body.id

        // Add product to cart
        await request(app.getHttpServer())
            .post('/cart')
            .set('user-id', userId)
            .send({ productId, amount: 2 })
            .expect(201)
    })

    afterAll(async () => {
        await prisma.$executeRawUnsafe('TRUNCATE TABLE "users" CASCADE');
        await prisma.$executeRawUnsafe('TRUNCATE TABLE "products" CASCADE');
        await prisma.$executeRawUnsafe('TRUNCATE TABLE "orders" CASCADE');
        await prisma.$disconnect();
        await app.close();
    });

    it('/POST orders - should create an order (checkout with PIX)', async () => {
        const response = await request(app.getHttpServer())
            .post('/orders')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                address: 'Rua Teste, 123',
                paymentMethod: 'PIX'
            })
            .expect(201)

        orderId = response.body.id

        console.log(response.body)
        expect(response.body).toHaveProperty('id')
        expect(response.body.address).toBe('Rua Teste, 123')
        expect(response.body.orderItems).toBeInstanceOf(Array)
        expect(response.body.payment).toBeDefined()
    })

    it('/POST orders - should fail with empty cart', async () => {
        await request(app.getHttpServer())
            .post('/orders')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                address: 'Rua Vazia, 0',
                paymentMethod: 'PIX'
            })
            .expect(400)
    })

    it('/GET orders - should find orders by user', async () => {
        const response = await request(app.getHttpServer())
            .get('/orders')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)

        console.log(response.body)
        expect(response.body).toBeDefined()
        expect(response.body.userId).toBe(userId)
    })

    it('/GET orders/:id - should find a specific order', async () => {
        const response = await request(app.getHttpServer())
            .get(`/orders/${orderId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)

        console.log(response.body)
        expect(response.body.id).toBe(orderId)
        expect(response.body.orderItems).toBeInstanceOf(Array)
    })

    it('/PATCH orders/:id - should update payment status', async () => {
        const response = await request(app.getHttpServer())
            .patch(`/orders/${orderId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ paymentStatus: 'CAPTURED' })
            .expect(200)

        console.log(response.body)
        expect(response.body.id).toBe(orderId)
    })

    it('/PATCH orders/:id/status - should update order status', async () => {
        const response = await request(app.getHttpServer())
            .patch(`/orders/${orderId}/status`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ status: 'CANCELED' })
            .expect(200)

        console.log(response.body)
        expect(response.body.status).toBe('CANCELED')
    })

    it('/POST orders - should fail without auth', async () => {
        await request(app.getHttpServer())
            .post('/orders')
            .send({
                address: 'Rua Sem Auth, 0',
                paymentMethod: 'PIX'
            })
            .expect(401)
    })
})
