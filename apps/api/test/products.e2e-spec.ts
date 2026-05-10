import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AppModule } from 'src/app/app.module';

describe('Products', () => {
    let app: INestApplication
    let prisma: DatabaseService
    let sellerId: string
    let productId: string
    let mediaTypeId: number

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

        // Ensure media types exist
        await prisma.mediaType.createMany({
            data: [{ name: 'GAME' }, { name: 'MOVIE' }],
            skipDuplicates: true,
        });

        const mediaType = await prisma.mediaType.findFirst({ where: { name: 'GAME' } });
        mediaTypeId = mediaType!.id;

        // Create a seller user
        const sellerUser = await request(app.getHttpServer())
            .post('/users')
            .send({
                name: 'seller-user',
                email: 'seller@example.com',
                password: 'Strong123@'
            })
            .expect(201)

        sellerId = sellerUser.body.newUser.id

        // Update role to SELLER
        await prisma.user.update({
            where: { id: sellerId },
            data: { role: 'SELLER' }
        })
    })

    afterAll(async () => {
        await prisma.$executeRawUnsafe('TRUNCATE TABLE "users" CASCADE');
        await prisma.$executeRawUnsafe('TRUNCATE TABLE "products" CASCADE');
        await prisma.$disconnect();
        await app.close();
    });

    it('/POST products - should create a product', async () => {
        const productData = {
            name: 'Super Mario World',
            price: 59.99,
            description: 'Classic SNES game',
            amount: 10,
            mediaTypeId: mediaTypeId
        }

        const response = await request(app.getHttpServer())
            .post('/products')
            .set('user-id', sellerId)
            .send(productData)
            .expect(201)

        productId = response.body.id

        console.log(response.body)
        expect(response.body.name).toBe(productData.name)
        expect(response.body.sellerId).toBe(sellerId)
        expect(response.body).toHaveProperty('id')
    })

    it('/POST products - should fail without seller-id header', async () => {
        const productData = {
            name: 'Zelda',
            price: 49.99,
            description: 'Adventure game',
            amount: 5,
            mediaTypeId: mediaTypeId
        }

        await request(app.getHttpServer())
            .post('/products')
            .send(productData)
            .expect(401)
    })

    it('/GET products - should return all active products', async () => {
        const response = await request(app.getHttpServer())
            .get('/products')
            .expect(200)

        console.log(response.body)
        expect(response.body).toBeInstanceOf(Array)
        expect(response.body.length).toBeGreaterThanOrEqual(1)
    })

    it('/GET products/:id - should return a product by id', async () => {
        const response = await request(app.getHttpServer())
            .get(`/products/${productId}`)
            .expect(200)

        console.log(response.body)
        expect(response.body.id).toBe(productId)
    })

    it('/PATCH products/:id - should update a product', async () => {
        const updateData = {
            name: 'Super Mario World UPDATED',
            price: 39.99
        }

        const response = await request(app.getHttpServer())
            .patch(`/products/${productId}`)
            .set('user-id', sellerId)
            .send(updateData)
            .expect(200)

        console.log(response.body)
        expect(response.body.name).toBe(updateData.name)
    })

    it('/PATCH products/soft-delete/:id - should soft delete a product', async () => {
        const response = await request(app.getHttpServer())
            .patch(`/products/soft-delete/${productId}`)
            .set('user-id', sellerId)
            .expect(200)

        console.log(response.body)
        expect(response.body.isActive).toBe(false)
    })

    it('/GET products - should not return soft-deleted products', async () => {
        const response = await request(app.getHttpServer())
            .get('/products')
            .expect(200)

        const found = response.body.find((p: any) => p.id === productId)
        expect(found).toBeUndefined()
    })

    it('/DELETE products/:id - should delete a product', async () => {
        // First, re-create a product to delete
        const createResponse = await request(app.getHttpServer())
            .post('/products')
            .set('user-id', sellerId)
            .send({
                name: 'Product to Delete',
                price: 9.99,
                description: 'Will be deleted',
                amount: 1,
                mediaTypeId: mediaTypeId
            })
            .expect(201)

        const deleteId = createResponse.body.id

        const response = await request(app.getHttpServer())
            .delete(`/products/${deleteId}`)
            .set('user-id', sellerId)
            .expect(200)

        console.log(response.body)
        expect(response.body.id).toBe(deleteId)
    })
})
