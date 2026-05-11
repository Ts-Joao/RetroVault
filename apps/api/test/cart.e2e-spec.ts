import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AppModule } from 'src/app/app.module';

describe('Cart', () => {
    let app: INestApplication
    let prisma: DatabaseService
    let userId: string
    let sellerId: string
    let productId: string
    let cartItemId: string
    let cartId: string

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

        // Create a buyer user
        const buyerResponse = await request(app.getHttpServer())
            .post('/users')
            .send({
                name: 'cart-buyer',
                email: 'buyer@example.com',
                password: 'Strong123@'
            })
            .expect(201)

        userId = buyerResponse.body.newUser.id

        // Create a seller user
        const sellerResponse = await request(app.getHttpServer())
            .post('/users')
            .send({
                name: 'cart-seller',
                email: 'cart-seller@example.com',
                password: 'Strong123@'
            })
            .expect(201)

        sellerId = sellerResponse.body.newUser.id

        // Update role to SELLER
        await prisma.user.update({
            where: { id: sellerId },
            data: { role: 'SELLER' }
        })

        // Create a product for the cart
        const mediaType = await prisma.mediaType.findFirst({ where: { name: 'GAME' } });

        const productResponse = await request(app.getHttpServer())
            .post('/products')
            .set('user-id', sellerId)
            .send({
                name: 'Cart Test Product',
                price: 29.99,
                description: 'Product for cart tests',
                amount: 20,
                mediaTypeId: mediaType!.id
            })
            .expect(201)

        productId = productResponse.body.id
    })

    afterAll(async () => {
        await prisma.$executeRawUnsafe('TRUNCATE TABLE "users" CASCADE');
        await prisma.$executeRawUnsafe('TRUNCATE TABLE "products" CASCADE');
        await prisma.$disconnect();
        await app.close();
    });

    it('/POST cart - should add item to cart', async () => {
        const response = await request(app.getHttpServer())
            .post('/cart')
            .set('user-id', userId)
            .send({
                productId: productId,
                amount: 2
            })
            .expect(201)

        cartItemId = response.body.id

        console.log(response.body)
        expect(response.body.amount).toBe(2)
        expect(response.body.product).toBeDefined()
        expect(response.body.product.id).toBe(productId)
    })

    it('/POST cart - should increase amount when adding same product', async () => {
        const response = await request(app.getHttpServer())
            .post('/cart')
            .set('user-id', userId)
            .send({
                productId: productId,
                amount: 3
            })
            .expect(201)

        console.log(response.body)
        expect(response.body.amount).toBe(5) // 2 + 3
    })

    it('/GET cart - should get cart with items and total', async () => {
        const response = await request(app.getHttpServer())
            .get('/cart')
            .set('user-id', userId)
            .expect(200)

        cartId = response.body.cart.id

        console.log(response.body)
        expect(response.body).toHaveProperty('cart')
        expect(response.body).toHaveProperty('total')
        expect(response.body).toHaveProperty('itemCount')
        expect(response.body.cart.cartItem).toBeInstanceOf(Array)
        expect(response.body.cart.cartItem.length).toBe(1)
    })

    it('/PATCH cart/:id - should update item amount', async () => {
        const response = await request(app.getHttpServer())
            .patch(`/cart/${cartItemId}`)
            .set('user-id', userId)
            .send({ amount: 1 })
            .expect(200)

        console.log(response.body)
        expect(response.body.amount).toBe(1)
    })

    it('/DELETE cart/:id - should remove item from cart', async () => {
        const response = await request(app.getHttpServer())
            .delete(`/cart/${cartId}`)
            .set('user-id', userId)
            .send({ id: cartItemId })
            .expect(200)

        console.log(response.body)
        expect(response.body).toHaveProperty('where')
    })

    it('/DELETE cart - should clear the cart', async () => {
        // Add an item first
        await request(app.getHttpServer())
            .post('/cart')
            .set('user-id', userId)
            .send({
                productId: productId,
                amount: 1
            })
            .expect(201)

        const response = await request(app.getHttpServer())
            .delete('/cart')
            .set('user-id', userId)
            .expect(200)

        console.log(response.body)
        expect(response.body.message).toBe('cart successfully emptied')
    })
})
