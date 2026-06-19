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
      phone: '123456789',
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
      phone: '123456789',
    },
  });

  const seller2 = await prisma.user.upsert({
    where: { email: 'seller2@retrovault.com' },
    update: {},
    create: {
      name: 'Seller Two',
      email: 'seller2@retrovault.com',
      password: hashedPassword,
      slug: 'seller-two',
      role: 'SELLER',
      phone: '123456789',
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
      phone: '123456789',
    },
  });

  // ──────────────────────────────────────────
  // ProfilePhotos
  // ──────────────────────────────────────────
  await prisma.profilePhoto.upsert({
    where: { userId: seller.id },
    update: {},
    create: { url: 'https://placehold.co/200x200?text=Seller', userId: seller.id },
  });

  await prisma.profilePhoto.upsert({
    where: { userId: seller2.id },
    update: {},
    create: { url: 'https://placehold.co/200x200?text=Seller2', userId: seller2.id },
  });

  await prisma.profilePhoto.upsert({
    where: { userId: buyer.id },
    update: {},
    create: { url: 'https://placehold.co/200x200?text=Buyer', userId: buyer.id },
  });

  // ──────────────────────────────────────────
  // MediaTypes
  // ──────────────────────────────────────────
  await prisma.mediaType.createMany({
    data: [{ name: 'GAME' }, { name: 'MOVIE' }],
    skipDuplicates: true,
  });

  const gameType  = await prisma.mediaType.findUnique({ where: { name: 'GAME' } });
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
      { name: 'Thriller' },
      { name: 'Comedy' },
      { name: 'Strategy' },
      { name: 'Platformer' },
      { name: 'Fighting' },
      { name: 'Sports' },
    ],
    skipDuplicates: true,
  });

  const g = Object.fromEntries(
    await Promise.all(
      ['Action','RPG','Horror','Adventure','Sci-Fi','Drama','Thriller','Comedy','Strategy','Platformer','Fighting','Sports'].map(
        async (name) => [name, await prisma.genre.findUnique({ where: { name } })]
      )
    )
  ) as Record<string, { id: number; name: string }>;

  // ──────────────────────────────────────────
  // Coupons
  // ──────────────────────────────────────────
  await prisma.coupon.createMany({
    data: [
      { code: 'WELCOME10',  type: 'PERCENTAGE', value: 10, maxUses: 100, isActive: true,  expiresAt: new Date('2027-12-31') },
      { code: 'RETRO20',    type: 'PERCENTAGE', value: 20, maxUses: 50,  isActive: true,  expiresAt: new Date('2027-12-31') },
      { code: 'SAVE50',     type: 'FIXED',      value: 50, maxUses: 25,  isActive: true,  expiresAt: new Date('2027-12-31') },
      { code: 'FREESHIP',   type: 'FIXED',      value: 20, maxUses: 200, isActive: true,  expiresAt: new Date('2027-12-31') },
      { code: 'EXPIRED10',  type: 'PERCENTAGE', value: 10, maxUses: 100, isActive: true,  expiresAt: new Date('2025-01-01') },
      { code: 'INACTIVE15', type: 'PERCENTAGE', value: 15, maxUses: 100, isActive: false, expiresAt: new Date('2027-12-31') },
    ],
    skipDuplicates: true,
  });

  // ──────────────────────────────────────────
  // Products — Games (10)
  // ──────────────────────────────────────────
  const games = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'the-last-of-us-ps3' },
      update: {},
      create: {
        name: 'The Last of Us',
        slug: 'the-last-of-us-ps3',
        description: 'Jogo de sobrevivência pós-apocalíptico aclamado pela crítica.',
        price: 49.99, amount: 15, rating: 4.9,
        mediaTypeId: gameType!.id, sellerId: seller.id,
        cep: '88032000', city: 'Florianópolis', state: 'SC',
        shippingCost: 12.0, freeInstallments: 3, maxInstallments: 12,
        minInstallmentAmount: 10.0, monthlyInterestRate: 0.0199,
        genre: { connect: [{ id: g.Action.id }, { id: g.Adventure.id }] },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'baldurs-gate-3-pc' },
      update: {},
      create: {
        name: "Baldur's Gate 3",
        slug: 'baldurs-gate-3-pc',
        description: 'CRPG premiado com escolhas narrativas profundas.',
        price: 199.9, amount: 8, rating: 5.0,
        mediaTypeId: gameType!.id, sellerId: seller.id,
        cep: '11665050', city: 'São Sebastião', state: 'SP',
        shippingCost: 0, discountPrice: 159.9,
        discountStart: new Date('2025-06-01'),
        discountEnd: new Date('2025-06-30'),
        freeInstallments: 6, maxInstallments: 12,
        minInstallmentAmount: 15.0, monthlyInterestRate: 0.0199,
        genre: { connect: [{ id: g.RPG.id }, { id: g.Adventure.id }] },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'resident-evil-4-gamecube' },
      update: {},
      create: {
        name: 'Resident Evil 4',
        slug: 'resident-evil-4-gamecube',
        description: 'Clássico de terror e ação para GameCube, mídia física original.',
        price: 89.9, amount: 5, rating: 4.8,
        mediaTypeId: gameType!.id, sellerId: seller2.id,
        cep: '01310100', city: 'São Paulo', state: 'SP',
        shippingCost: 15.0, freeInstallments: 2, maxInstallments: 6,
        minInstallmentAmount: 15.0, monthlyInterestRate: 0.0199,
        genre: { connect: [{ id: g.Horror.id }, { id: g.Action.id }] },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'super-mario-odyssey-switch' },
      update: {},
      create: {
        name: 'Super Mario Odyssey',
        slug: 'super-mario-odyssey-switch',
        description: 'Aventura 3D do Mario para Nintendo Switch.',
        price: 249.9, amount: 12, rating: 4.9,
        mediaTypeId: gameType!.id, sellerId: seller.id,
        cep: '11665050', city: 'São Sebastião', state: 'SP',
        shippingCost: 0, discountPrice: 199.9,
        discountStart: new Date('2026-07-01'),
        discountEnd: new Date('2026-07-31'),
        freeInstallments: 6, maxInstallments: 12,
        minInstallmentAmount: 20.0, monthlyInterestRate: 0.0199,
        genre: { connect: [{ id: g.Platformer.id }, { id: g.Adventure.id }] },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'dark-souls-remastered-ps4' },
      update: {},
      create: {
        name: 'Dark Souls Remastered',
        slug: 'dark-souls-remastered-ps4',
        description: 'Versão remasterizada do RPG de ação mais desafiador da geração.',
        price: 79.9, amount: 10, rating: 4.7,
        mediaTypeId: gameType!.id, sellerId: seller2.id,
        cep: '01310100', city: 'São Paulo', state: 'SP',
        shippingCost: 10.0, freeInstallments: 2, maxInstallments: 6,
        minInstallmentAmount: 13.0, monthlyInterestRate: 0.0199,
        genre: { connect: [{ id: g.RPG.id }, { id: g.Action.id }] },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'god-of-war-ps4' },
      update: {},
      create: {
        name: 'God of War (2018)',
        slug: 'god-of-war-ps4',
        description: 'Kratos e Atreus em uma épica jornada pela mitologia nórdica.',
        price: 69.9, amount: 18, rating: 4.9,
        mediaTypeId: gameType!.id, sellerId: seller.id,
        cep: '88032000', city: 'Florianópolis', state: 'SC',
        shippingCost: 8.0, freeInstallments: 3, maxInstallments: 10,
        minInstallmentAmount: 10.0, monthlyInterestRate: 0.0199,
        genre: { connect: [{ id: g.Action.id }, { id: g.Adventure.id }] },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'halo-3-xbox-360' },
      update: {},
      create: {
        name: 'Halo 3',
        slug: 'halo-3-xbox-360',
        description: 'FPS icônico do Xbox 360, mídia física original.',
        price: 39.9, amount: 7, rating: 4.6,
        mediaTypeId: gameType!.id, sellerId: seller2.id,
        cep: '30112000', city: 'Belo Horizonte', state: 'MG',
        shippingCost: 9.0, freeInstallments: 1, maxInstallments: 4,
        minInstallmentAmount: 10.0, monthlyInterestRate: 0.0199,
        genre: { connect: [{ id: g.Action.id }, { id: g['Sci-Fi'].id }] },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'street-fighter-iv-ps3' },
      update: {},
      create: {
        name: 'Street Fighter IV',
        slug: 'street-fighter-iv-ps3',
        description: 'O renascimento do jogo de luta mais famoso do mundo.',
        price: 34.9, amount: 9, rating: 4.4,
        mediaTypeId: gameType!.id, sellerId: seller.id,
        cep: '11665050', city: 'São Sebastião', state: 'SP',
        shippingCost: 7.0, freeInstallments: 1, maxInstallments: 3,
        minInstallmentAmount: 10.0,
        genre: { connect: [{ id: g.Fighting.id }, { id: g.Action.id }] },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'civilization-vi-pc' },
      update: {},
      create: {
        name: 'Civilization VI',
        slug: 'civilization-vi-pc',
        description: 'Construa um império que resista ao tempo neste 4X clássico.',
        price: 59.9, amount: 14, rating: 4.5,
        mediaTypeId: gameType!.id, sellerId: seller2.id,
        cep: '80010000', city: 'Curitiba', state: 'PR',
        shippingCost: 0, freeInstallments: 2, maxInstallments: 6,
        minInstallmentAmount: 10.0, monthlyInterestRate: 0.0199,
        genre: { connect: [{ id: g.Strategy.id }] },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'fifa-06-ps2' },
      update: {},
      create: {
        name: 'FIFA 06',
        slug: 'fifa-06-ps2',
        description: 'Edição clássica de futebol para PS2, mídia original.',
        price: 24.9, amount: 20, rating: 4.1,
        mediaTypeId: gameType!.id, sellerId: seller.id,
        cep: '40301110', city: 'Salvador', state: 'BA',
        shippingCost: 6.0, freeInstallments: 1, maxInstallments: 2,
        minInstallmentAmount: 10.0,
        genre: { connect: [{ id: g.Sports.id }] },
      },
    }),
  ]);

  // ──────────────────────────────────────────
  // Products — Movies (8)
  // ──────────────────────────────────────────
  const movies = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'alien-1979-blu-ray' },
      update: {},
      create: {
        name: 'Alien (1979)',
        slug: 'alien-1979-blu-ray',
        description: 'Clássico de terror sci-fi de Ridley Scott em Blu-ray.',
        price: 29.9, amount: 20, rating: 4.7,
        mediaTypeId: movieType!.id, sellerId: seller.id,
        cep: '11665050', city: 'São Sebastião', state: 'SP',
        shippingCost: 8.5, freeInstallments: 1, maxInstallments: 3,
        minInstallmentAmount: 10.0,
        genre: { connect: [{ id: g.Horror.id }, { id: g['Sci-Fi'].id }] },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'schindlers-list-dvd' },
      update: {},
      create: {
        name: "Schindler's List",
        slug: 'schindlers-list-dvd',
        description: 'Obra-prima de Spielberg em DVD.',
        price: 19.9, amount: 30, rating: 4.8,
        mediaTypeId: movieType!.id, sellerId: seller.id,
        cep: '88032000', city: 'Florianópolis', state: 'SC',
        shippingCost: 6.0, freeInstallments: 1, maxInstallments: 2,
        minInstallmentAmount: 10.0,
        genre: { connect: [{ id: g.Drama.id }] },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'the-godfather-blu-ray' },
      update: {},
      create: {
        name: 'The Godfather',
        slug: 'the-godfather-blu-ray',
        description: 'O padrinho — trilogia completa em Blu-ray remasterizado.',
        price: 89.9, amount: 10, rating: 5.0,
        mediaTypeId: movieType!.id, sellerId: seller2.id,
        cep: '01310100', city: 'São Paulo', state: 'SP',
        shippingCost: 12.0, discountPrice: 69.9,
        discountStart: new Date('2026-06-01'),
        discountEnd: new Date('2026-08-31'),
        freeInstallments: 2, maxInstallments: 6,
        minInstallmentAmount: 15.0, monthlyInterestRate: 0.0199,
        genre: { connect: [{ id: g.Drama.id }, { id: g.Thriller.id }] },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'blade-runner-2049-4k' },
      update: {},
      create: {
        name: 'Blade Runner 2049',
        slug: 'blade-runner-2049-4k',
        description: 'Sequência visualmente deslumbrante em UHD 4K.',
        price: 49.9, amount: 15, rating: 4.6,
        mediaTypeId: movieType!.id, sellerId: seller.id,
        cep: '11665050', city: 'São Sebastião', state: 'SP',
        shippingCost: 9.0, freeInstallments: 1, maxInstallments: 4,
        minInstallmentAmount: 12.0, monthlyInterestRate: 0.0199,
        genre: { connect: [{ id: g['Sci-Fi'].id }, { id: g.Thriller.id }] },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'pulp-fiction-dvd' },
      update: {},
      create: {
        name: 'Pulp Fiction',
        slug: 'pulp-fiction-dvd',
        description: 'Tarantino em sua melhor forma — edição especial em DVD.',
        price: 22.9, amount: 25, rating: 4.9,
        mediaTypeId: movieType!.id, sellerId: seller2.id,
        cep: '80010000', city: 'Curitiba', state: 'PR',
        shippingCost: 7.0, freeInstallments: 1, maxInstallments: 2,
        minInstallmentAmount: 10.0,
        genre: { connect: [{ id: g.Drama.id }, { id: g.Thriller.id }] },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'the-shining-blu-ray' },
      update: {},
      create: {
        name: 'The Shining',
        slug: 'the-shining-blu-ray',
        description: 'Kubrick e Nicholson no horror psicológico definitivo.',
        price: 34.9, amount: 12, rating: 4.7,
        mediaTypeId: movieType!.id, sellerId: seller.id,
        cep: '30112000', city: 'Belo Horizonte', state: 'MG',
        shippingCost: 8.0, freeInstallments: 1, maxInstallments: 3,
        minInstallmentAmount: 10.0,
        genre: { connect: [{ id: g.Horror.id }, { id: g.Thriller.id }] },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'back-to-the-future-trilogy-blu-ray' },
      update: {},
      create: {
        name: 'Back to the Future Trilogy',
        slug: 'back-to-the-future-trilogy-blu-ray',
        description: 'A trilogia completa De Volta para o Futuro em Blu-ray.',
        price: 74.9, amount: 8, rating: 4.8,
        mediaTypeId: movieType!.id, sellerId: seller2.id,
        cep: '40301110', city: 'Salvador', state: 'BA',
        shippingCost: 11.0, freeInstallments: 2, maxInstallments: 6,
        minInstallmentAmount: 12.5, monthlyInterestRate: 0.0199,
        genre: { connect: [{ id: g['Sci-Fi'].id }, { id: g.Comedy.id }, { id: g.Adventure.id }] },
      },
    }),
    prisma.product.upsert({
      where: { slug: 'parasite-blu-ray' },
      update: {},
      create: {
        name: 'Parasite',
        slug: 'parasite-blu-ray',
        description: 'Vencedor do Oscar de Melhor Filme de Bong Joon-ho em Blu-ray.',
        price: 39.9, amount: 18, rating: 4.9,
        mediaTypeId: movieType!.id, sellerId: seller.id,
        cep: '11665050', city: 'São Sebastião', state: 'SP',
        shippingCost: 8.0, freeInstallments: 1, maxInstallments: 3,
        minInstallmentAmount: 10.0,
        genre: { connect: [{ id: g.Drama.id }, { id: g.Thriller.id }] },
      },
    }),
  ]);

  const allProducts = [...games, ...movies];

  // ──────────────────────────────────────────
  // ProductPhotos (3 por produto)
  // ──────────────────────────────────────────
  await prisma.productPhoto.createMany({
    data: allProducts.flatMap((p) => [
      { url: `https://placehold.co/400x400?text=${encodeURIComponent(p.name)}+1`, productId: p.id },
      { url: `https://placehold.co/400x400?text=${encodeURIComponent(p.name)}+2`, productId: p.id },
      { url: `https://placehold.co/400x400?text=${encodeURIComponent(p.name)}+3`, productId: p.id },
    ]),
    skipDuplicates: true,
  });

  // ──────────────────────────────────────────
  // ProductViews
  // ──────────────────────────────────────────
  await prisma.productView.createMany({
    data: allProducts.flatMap((p, i) =>
      Array.from({ length: (i % 4) + 1 }, () => ({ productId: p.id }))
    ),
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
    where: { cartId_productId: { cartId: cart.id, productId: games[0].id } },
    update: {},
    create: { cartId: cart.id, productId: games[0].id, amount: 1, price: games[0].price },
  });

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId: movies[0].id } },
    update: {},
    create: { cartId: cart.id, productId: movies[0].id, amount: 2, price: movies[0].price },
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
          { productId: games[0].id, amount: 1, price: games[0].price },
          { productId: movies[0].id, amount: 1, price: movies[0].price },
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
  const payment = await prisma.payment.findUnique({ where: { orderId: order.id } });

  await prisma.walletTransaction.createMany({
    data: [
      { walletId: buyerWallet.id,  amount: 500.0,  type: 'DEPOSIT',    description: 'Depósito inicial de seed' },
      { walletId: sellerWallet.id, amount: 1200.0, type: 'DEPOSIT',    description: 'Depósito inicial de seed' },
      { walletId: buyerWallet.id,  amount: 79.89,  type: 'WITHDRAWAL', description: `Pagamento do pedido ${order.id}`, paymentId: payment!.id },
    ],
  });

  await prisma.$disconnect();
  await pool.end();
}

void bootstrap();