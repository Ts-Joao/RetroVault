import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function bootstrap() {
  // ──────────────────────────────────────────
  // Users
  // ──────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('Admin@123456', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@retrovault.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@retrovault.com',
      password: hashedPassword,
      slug: 'admin',
      role: 'ADMIN',
    },
  });

  const seller = await prisma.user.upsert({
    where: { email: 'seller@retrovault.com' },
    update: {},
    create: {
      name: 'Seller One',
      email: 'seller@retrovault.com',
      password: hashedPassword,
      slug: 'seller-one',
      role: 'SELLER',
    },
  });

  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@retrovault.com' },
    update: {},
    create: {
      name: 'Buyer One',
      email: 'buyer@retrovault.com',
      password: hashedPassword,
      slug: 'buyer-one',
      role: 'USER',
    },
  });

  // ──────────────────────────────────────────
  // ProfilePhotos
  // ──────────────────────────────────────────
  await prisma.profilePhoto.upsert({
    where: { userId: seller.id },
    update: {},
    create: {
      url: 'https://placehold.co/200x200?text=Seller',
      userId: seller.id,
    },
  });

  await prisma.profilePhoto.upsert({
    where: { userId: buyer.id },
    update: {},
    create: {
      url: 'https://placehold.co/200x200?text=Buyer',
      userId: buyer.id,
    },
  });

  // ──────────────────────────────────────────
  // MediaTypes
  // ──────────────────────────────────────────
  await prisma.mediaType.createMany({
    data: [{ name: 'GAME' }, { name: 'MOVIE' }],
    skipDuplicates: true,
  });

  const gameType = await prisma.mediaType.findUnique({ where: { name: 'GAME' } });
  const movieType = await prisma.mediaType.findUnique({ where: { name: 'MOVIE' } });

  // ──────────────────────────────────────────
  // Genres
  // ──────────────────────────────────────────
  await prisma.genre.createMany({
    data: [
      { name: 'Action' },
      { name: 'RPG' },
      { name: 'Horror' },
      { name: 'Adventure' },
      { name: 'Sci-Fi' },
      { name: 'Drama' },
    ],
    skipDuplicates: true,
  });

  // ──────────────────────────────────────────
  // Coupons
  // ──────────────────────────────────────────
  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME10',
        type: 'PERCENTAGE',
        value: 10,
        maxUses: 100,
        isActive: true,
        expiresAt: new Date('2027-12-31'),
      },
      {
        code: 'RETRO20',
        type: 'PERCENTAGE',
        value: 20,
        maxUses: 50,
        isActive: true,
        expiresAt: new Date('2027-12-31'),
      },
      {
        code: 'SAVE50',
        type: 'FIXED',
        value: 50,
        maxUses: 25,
        isActive: true,
        expiresAt: new Date('2027-12-31'),
      },
      {
        code: 'FREESHIP',
        type: 'FIXED',
        value: 20,
        maxUses: 200,
        isActive: true,
        expiresAt: new Date('2027-12-31'),
      },
      {
        code: 'EXPIRED10',
        type: 'PERCENTAGE',
        value: 10,
        maxUses: 100,
        isActive: true,
        expiresAt: new Date('2025-01-01'),
      },
      {
        code: 'INACTIVE15',
        type: 'PERCENTAGE',
        value: 15,
        maxUses: 100,
        isActive: false,
        expiresAt: new Date('2027-12-31'),
      },
    ],
    skipDuplicates: true,
  })


  const actionGenre    = await prisma.genre.findUnique({ where: { name: 'Action' } });
  const rpgGenre       = await prisma.genre.findUnique({ where: { name: 'RPG' } });
  const horrorGenre    = await prisma.genre.findUnique({ where: { name: 'Horror' } });
  const adventureGenre = await prisma.genre.findUnique({ where: { name: 'Adventure' } });
  const scifiGenre     = await prisma.genre.findUnique({ where: { name: 'Sci-Fi' } });
  const dramaGenre     = await prisma.genre.findUnique({ where: { name: 'Drama' } });

  // ──────────────────────────────────────────
  // Products
  // ──────────────────────────────────────────
  const gameOne = await prisma.product.upsert({
    where: { slug: 'the-last-of-us-ps3' },
    update: {},
    create: {
      name: 'The Last of Us',
      slug: 'the-last-of-us-ps3',
      description: 'Post-apocalyptic survival game set in the US.',
      price: 49.99,
      amount: 15,
      rating: 4.9,
      mediaTypeId: gameType!.id,
      sellerId: seller.id,
      freeInstallments: 3,
      maxInstallments: 12,
      minInstallmentAmount: 10.0,
      monthlyInterestRate: 0.0199,
      shippingCost: 12.0,
      genre: { connect: [{ id: actionGenre!.id }, { id: adventureGenre!.id }] },
    },
  });

  const gameTwo = await prisma.product.upsert({
    where: { slug: 'baldurs-gate-3-pc' },
    update: {},
    create: {
      name: "Baldur's Gate 3",
      slug: 'baldurs-gate-3-pc',
      description: 'Award-winning CRPG with deep narrative choices.',
      price: 199.9,
      amount: 8,
      rating: 5.0,
      mediaTypeId: gameType!.id,
      sellerId: seller.id,
      discountPrice: 159.9,
      discountStart: new Date('2025-06-01'),
      discountEnd: new Date('2025-06-30'),
      freeInstallments: 6,
      maxInstallments: 12,
      minInstallmentAmount: 15.0,
      monthlyInterestRate: 0.0199,
      shippingCost: 0,
      genre: { connect: [{ id: rpgGenre!.id }, { id: adventureGenre!.id }] },
    },
  });

  const movie1 = await prisma.product.upsert({
    where: { slug: 'alien-1979-blu-ray' },
    update: {},
    create: {
      name: 'Alien (1979)',
      slug: 'alien-1979-blu-ray',
      description: 'Ridley Scott classic sci-fi horror on Blu-ray.',
      price: 29.9,
      amount: 20,
      rating: 4.7,
      mediaTypeId: movieType!.id,
      sellerId: seller.id,
      freeInstallments: 1,
      maxInstallments: 3,
      minInstallmentAmount: 10.0,
      shippingCost: 8.5,
      genre: { connect: [{ id: horrorGenre!.id }, { id: scifiGenre!.id }] },
    },
  });

  const movie2 = await prisma.product.upsert({
    where: { slug: 'schindlers-list-dvd' },
    update: {},
    create: {
      name: "Schindler's List",
      slug: 'schindlers-list-dvd',
      description: 'Steven Spielberg masterpiece on DVD.',
      price: 19.9,
      amount: 30,
      rating: 4.8,
      mediaTypeId: movieType!.id,
      sellerId: seller.id,
      freeInstallments: 1,
      maxInstallments: 2,
      minInstallmentAmount: 10.0,
      shippingCost: 6.0,
      genre: { connect: [{ id: dramaGenre!.id }] },
    },
  });

  // ──────────────────────────────────────────
  // ProductPhotos
  // ──────────────────────────────────────────
  await prisma.productPhoto.createMany({
    data: [
      { url: 'https://placehold.co/400x400?text=TLOU+1', productId: gameOne.id },
      { url: 'https://placehold.co/400x400?text=TLOU+2', productId: gameOne.id },
      { url: 'https://placehold.co/400x400?text=BG3+1',  productId: gameTwo.id },
      { url: 'https://placehold.co/400x400?text=Alien',  productId: movie1.id },
      { url: 'https://placehold.co/400x400?text=Schindler', productId: movie2.id },
    ],
    skipDuplicates: true,
  });

  // ──────────────────────────────────────────
  // ProductViews
  // ──────────────────────────────────────────
  await prisma.productView.createMany({
    data: [
      { productId: gameOne.id },
      { productId: gameOne.id },
      { productId: gameTwo.id },
      { productId: movie1.id },
    ],
  });

  // ──────────────────────────────────────────
  // Wallets
  // ──────────────────────────────────────────
  const buyerWallet = await prisma.wallet.upsert({
    where: { userId: buyer.id },
    update: {},
    create: { userId: buyer.id, balance: 500.0 },
  });

  const sellerWallet = await prisma.wallet.upsert({
    where: { userId: seller.id },
    update: {},
    create: { userId: seller.id, balance: 1200.0 },
  });

  // ──────────────────────────────────────────
  // Cart + CartItems
  // ──────────────────────────────────────────
  const cart = await prisma.cart.upsert({
    where: { userId: buyer.id },
    update: {},
    create: { userId: buyer.id },
  });

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId: gameOne.id } },
    update: {},
    create: {
      cartId: cart.id,
      productId: gameOne.id,
      amount: 1,
      price: gameOne.price,
    },
  });

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId: movie1.id } },
    update: {},
    create: {
      cartId: cart.id,
      productId: movie1.id,
      amount: 2,
      price: movie1.price,
    },
  });

  // ──────────────────────────────────────────
  // Order + OrderItems + Payment
  // ──────────────────────────────────────────
  const order = await prisma.order.create({
    data: {
      userId: buyer.id,
      totalAmount: 79.89,
      address: 'Rua das Retro Games, 42, São Paulo - SP',
      status: 'PAID',
      orderItems: {
        create: [
          { productId: gameOne.id, amount: 1, price: gameOne.price },
          { productId: movie1.id, amount: 1, price: movie1.price },
        ],
      },
      payment: {
        create: {
          status: 'CAPTURED',
          paymentMethod: 'CREDIT_CARD',
          installments: 3,
          paidAt: new Date(),
          confirmationCode: 'RV-SEED-0001',
          tokenExpiresAt: null,
        },
      },
    },
  });

  // ──────────────────────────────────────────
  // WalletTransactions
  // ──────────────────────────────────────────
  const payment = await prisma.payment.findUnique({
    where: { orderId: order.id },
  });

  await prisma.walletTransaction.createMany({
    data: [
      {
        walletId: buyerWallet.id,
        amount: 500.0,
        type: 'DEPOSIT',
        description: 'Depósito inicial de seed',
      },
      {
        walletId: sellerWallet.id,
        amount: 1200.0,
        type: 'DEPOSIT',
        description: 'Depósito inicial de seed',
      },
      {
        walletId: buyerWallet.id,
        amount: 79.89,
        type: 'WITHDRAWAL',
        description: `Pagamento do pedido ${order.id}`,
        paymentId: payment!.id,
      },
    ],
  });

  console.log('Seed executed successfully.');
  await prisma.$disconnect();
  await pool.end();
}

void bootstrap();