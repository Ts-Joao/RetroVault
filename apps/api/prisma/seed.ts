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
  // Reviewer Users (apenas para gerar avaliações realistas)
  // ──────────────────────────────────────────
  const reviewerNames = [
    'Carlos Mendes', 'Fernanda Lima', 'João Pedro Alves', 'Beatriz Souza',
    'Lucas Ferreira', 'Mariana Costa', 'Rafael Oliveira', 'Camila Rocha',
    'Thiago Barbosa', 'Juliana Pereira', 'Eduardo Santos', 'Patrícia Gomes',
  ];

  const reviewers = await Promise.all(
    reviewerNames.map((name, i) => {
      const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
      return prisma.user.upsert({
        where: { email: `reviewer${i + 1}@retrovault.com` },
        update: {},
        create: {
          name,
          email: `reviewer${i + 1}@retrovault.com`,
          password: hashedPassword,
          slug,
          role: 'USER',
          phone: '123456789',
        },
      });
    }),
  );

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
      { name: 'Thriller' },
      { name: 'Comedy' },
      { name: 'Strategy' },
      { name: 'Platformer' },
      { name: 'Fighting' },
      { name: 'Sports' },
      { name: 'Racing' },
      { name: 'Puzzle' },
      { name: 'Animation' },
    ],
    skipDuplicates: true,
  });

  const genreNames = [
    'Action', 'RPG', 'Horror', 'Adventure', 'Sci-Fi', 'Drama', 'Thriller',
    'Comedy', 'Strategy', 'Platformer', 'Fighting', 'Sports', 'Racing',
    'Puzzle', 'Animation',
  ];

  const g = Object.fromEntries(
    await Promise.all(
      genreNames.map(async (name) => [name, await prisma.genre.findUnique({ where: { name } })]),
    ),
  ) as Record<string, { id: number; name: string }>;

  // ──────────────────────────────────────────
  // Coupons
  // ──────────────────────────────────────────
  await prisma.coupon.createMany({
    data: [
      { code: 'WELCOME10', type: 'PERCENTAGE', value: 10, maxUses: 100, isActive: true, expiresAt: new Date('2027-12-31') },
      { code: 'RETRO20', type: 'PERCENTAGE', value: 20, maxUses: 50, isActive: true, expiresAt: new Date('2027-12-31') },
      { code: 'SAVE50', type: 'FIXED', value: 50, maxUses: 25, isActive: true, expiresAt: new Date('2027-12-31') },
      { code: 'FREESHIP', type: 'FIXED', value: 20, maxUses: 200, isActive: true, expiresAt: new Date('2027-12-31') },
      { code: 'EXPIRED10', type: 'PERCENTAGE', value: 10, maxUses: 100, isActive: true, expiresAt: new Date('2025-01-01') },
      { code: 'INACTIVE15', type: 'PERCENTAGE', value: 15, maxUses: 100, isActive: false, expiresAt: new Date('2027-12-31') },
    ],
    skipDuplicates: true,
  });

  // ──────────────────────────────────────────
  // Products — Games (10)
  // ──────────────────────────────────────────
  const gameSeeds = [
    {
      name: 'The Last of Us',
      slug: 'the-last-of-us-ps3',
      description: 'Jogo de sobrevivência pós-apocalíptico aclamado pela crítica.',
      price: 49.99, amount: 15, rating: 4.9,
      sellerId: seller.id,
      cep: '88032000', city: 'Florianópolis', state: 'SC',
      shippingCost: 12.0, freeInstallments: 3, maxInstallments: 12,
      minInstallmentAmount: 10.0, monthlyInterestRate: 0.0199,
      genreIds: [g.Action.id, g.Adventure.id],
      salesCount: 33
    },
    {
      name: "Baldur's Gate 3",
      slug: 'baldurs-gate-3-pc',
      description: 'CRPG premiado com escolhas narrativas profundas.',
      price: 199.9, amount: 8, rating: 5.0,
      sellerId: seller.id,
      cep: '11665050', city: 'São Sebastião', state: 'SP',
      shippingCost: 0, discountPrice: 159.9,
      discountStart: new Date('2026-06-01'), discountEnd: new Date('2026-06-30'),
      freeInstallments: 6, maxInstallments: 12,
      minInstallmentAmount: 15.0, monthlyInterestRate: 0.0199,
      genreIds: [g.RPG.id, g.Adventure.id],
      salesCount: 5
    },
    {
      name: 'Resident Evil 4',
      slug: 'resident-evil-4-gamecube',
      description: 'Clássico de terror e ação para GameCube, mídia física original.',
      price: 89.9, amount: 5, rating: 4.8,
      sellerId: seller2.id,
      cep: '01310100', city: 'São Paulo', state: 'SP',
      shippingCost: 15.0, freeInstallments: 2, maxInstallments: 6,
      minInstallmentAmount: 15.0, monthlyInterestRate: 0.0199,
      genreIds: [g.Horror.id, g.Action.id],
      salesCount: 12
    },
    {
      name: 'Super Mario Odyssey',
      slug: 'super-mario-odyssey-switch',
      description: 'Aventura 3D do Mario para Nintendo Switch.',
      price: 249.9, amount: 12, rating: 4.9,
      sellerId: seller.id,
      cep: '11665050', city: 'São Sebastião', state: 'SP',
      shippingCost: 0, discountPrice: 199.9,
      discountStart: new Date('2026-07-01'), discountEnd: new Date('2026-07-31'),
      freeInstallments: 6, maxInstallments: 12,
      minInstallmentAmount: 20.0, monthlyInterestRate: 0.0199,
      genreIds: [g.Platformer.id, g.Adventure.id],
      salesCount: 10
    },
    {
      name: 'Dark Souls Remastered',
      slug: 'dark-souls-remastered-ps4',
      description: 'Versão remasterizada do RPG de ação mais desafiador da geração.',
      price: 79.9, amount: 10, rating: 4.7,
      sellerId: seller2.id,
      cep: '01310100', city: 'São Paulo', state: 'SP',
      shippingCost: 10.0, freeInstallments: 2, maxInstallments: 6,
      minInstallmentAmount: 13.0, monthlyInterestRate: 0.0199,
      genreIds: [g.RPG.id, g.Action.id],
      salesCount: 20
    },
    {
      name: 'God of War (2018)',
      slug: 'god-of-war-ps4',
      description: 'Kratos e Atreus em uma épica jornada pela mitologia nórdica.',
      price: 69.9, amount: 18, rating: 4.9,
      sellerId: seller.id,
      cep: '88032000', city: 'Florianópolis', state: 'SC',
      shippingCost: 8.0, freeInstallments: 3, maxInstallments: 10,
      minInstallmentAmount: 10.0, monthlyInterestRate: 0.0199,
      genreIds: [g.Action.id, g.Adventure.id],
      salesCount: 5
    },
    {
      name: 'Halo 3',
      slug: 'halo-3-xbox-360',
      description: 'FPS icônico do Xbox 360, mídia física original.',
      price: 39.9, amount: 7, rating: 4.6,
      sellerId: seller2.id,
      cep: '30112000', city: 'Belo Horizonte', state: 'MG',
      shippingCost: 9.0, freeInstallments: 1, maxInstallments: 4,
      minInstallmentAmount: 10.0, monthlyInterestRate: 0.0199,
      genreIds: [g.Action.id, g['Sci-Fi'].id],
      salesCount: 2
    },
    {
      name: 'Street Fighter IV',
      slug: 'street-fighter-iv-ps3',
      description: 'O renascimento do jogo de luta mais famoso do mundo.',
      price: 34.9, amount: 9, rating: 4.4,
      sellerId: seller.id,
      cep: '11665050', city: 'São Sebastião', state: 'SP',
      shippingCost: 7.0, freeInstallments: 1, maxInstallments: 3,
      minInstallmentAmount: 10.0,
      genreIds: [g.Fighting.id, g.Action.id],
      salesCount: 3
    },
    {
      name: 'Civilization VI',
      slug: 'civilization-vi-pc',
      description: 'Construa um império que resista ao tempo neste 4X clássico.',
      price: 59.9, amount: 14, rating: 4.5,
      sellerId: seller2.id,
      cep: '80010000', city: 'Curitiba', state: 'PR',
      shippingCost: 0, freeInstallments: 2, maxInstallments: 6,
      minInstallmentAmount: 10.0, monthlyInterestRate: 0.0199,
      genreIds: [g.Strategy.id],
      salesCount: 6
    },
    {
      name: 'FIFA 06',
      slug: 'fifa-06-ps2',
      description: 'Edição clássica de futebol para PS2, mídia original.',
      price: 24.9, amount: 20, rating: 4.1,
      sellerId: seller.id,
      cep: '40301110', city: 'Salvador', state: 'BA',
      shippingCost: 6.0, freeInstallments: 1, maxInstallments: 2,
      minInstallmentAmount: 10.0,
      genreIds: [g.Sports.id],
      salesCount: 3
    },
  ];

  // ──────────────────────────────────────────
  // Products — Movies (10)
  // ──────────────────────────────────────────
  const movieSeeds = [
    {
      name: 'Alien (1979)',
      slug: 'alien-1979-blu-ray',
      description: 'Clássico de terror sci-fi de Ridley Scott em Blu-ray.',
      price: 29.9, amount: 20, rating: 4.7,
      sellerId: seller.id,
      cep: '11665050', city: 'São Sebastião', state: 'SP',
      shippingCost: 8.5, freeInstallments: 1, maxInstallments: 3,
      minInstallmentAmount: 10.0,
      genreIds: [g.Horror.id, g['Sci-Fi'].id],
      salesCount: 1
    },
    {
      name: "Schindler's List",
      slug: 'schindlers-list-dvd',
      description: 'Obra-prima de Spielberg em DVD.',
      price: 19.9, amount: 30, rating: 4.8,
      sellerId: seller.id,
      cep: '88032000', city: 'Florianópolis', state: 'SC',
      shippingCost: 6.0, freeInstallments: 1, maxInstallments: 2,
      minInstallmentAmount: 10.0,
      genreIds: [g.Drama.id],
      salesCount: 3
    },
    {
      name: 'The Godfather',
      slug: 'the-godfather-blu-ray',
      description: 'O padrinho — trilogia completa em Blu-ray remasterizado.',
      price: 89.9, amount: 10, rating: 5.0,
      sellerId: seller2.id,
      cep: '01310100', city: 'São Paulo', state: 'SP',
      shippingCost: 12.0, discountPrice: 69.9,
      discountStart: new Date('2026-06-01'), discountEnd: new Date('2026-08-31'),
      freeInstallments: 2, maxInstallments: 6,
      minInstallmentAmount: 15.0, monthlyInterestRate: 0.0199,
      genreIds: [g.Drama.id, g.Thriller.id],
      salesCount: 5
    },
    {
      name: 'Blade Runner 2049',
      slug: 'blade-runner-2049-4k',
      description: 'Sequência visualmente deslumbrante em UHD 4K.',
      price: 49.9, amount: 15, rating: 4.6,
      sellerId: seller.id,
      cep: '11665050', city: 'São Sebastião', state: 'SP',
      shippingCost: 9.0, freeInstallments: 1, maxInstallments: 4,
      minInstallmentAmount: 12.0, monthlyInterestRate: 0.0199,
      genreIds: [g['Sci-Fi'].id, g.Thriller.id],
      salesCount: 7
    },
    {
      name: 'Pulp Fiction',
      slug: 'pulp-fiction-dvd',
      description: 'Tarantino em sua melhor forma — edição especial em DVD.',
      price: 22.9, amount: 25, rating: 4.9,
      sellerId: seller2.id,
      cep: '80010000', city: 'Curitiba', state: 'PR',
      shippingCost: 7.0, freeInstallments: 1, maxInstallments: 2,
      minInstallmentAmount: 10.0,
      genreIds: [g.Drama.id, g.Thriller.id],
      salesCount: 9
    },
    {
      name: 'The Shining',
      slug: 'the-shining-blu-ray',
      description: 'Kubrick e Nicholson no horror psicológico definitivo.',
      price: 34.9, amount: 12, rating: 4.7,
      sellerId: seller.id,
      cep: '30112000', city: 'Belo Horizonte', state: 'MG',
      shippingCost: 8.0, freeInstallments: 1, maxInstallments: 3,
      minInstallmentAmount: 10.0,
      genreIds: [g.Horror.id, g.Thriller.id],
      salesCount: 11
    },
    {
      name: 'Back to the Future Trilogy',
      slug: 'back-to-the-future-trilogy-blu-ray',
      description: 'A trilogia completa De Volta para o Futuro em Blu-ray.',
      price: 74.9, amount: 8, rating: 4.8,
      sellerId: seller2.id,
      cep: '40301110', city: 'Salvador', state: 'BA',
      shippingCost: 11.0, freeInstallments: 2, maxInstallments: 6,
      minInstallmentAmount: 12.5, monthlyInterestRate: 0.0199,
      genreIds: [g['Sci-Fi'].id, g.Comedy.id, g.Adventure.id],
      salesCount: 13
    },
    {
      name: 'Parasite',
      slug: 'parasite-blu-ray',
      description: 'Vencedor do Oscar de Melhor Filme de Bong Joon-ho em Blu-ray.',
      price: 39.9, amount: 18, rating: 4.9,
      sellerId: seller.id,
      cep: '11665050', city: 'São Sebastião', state: 'SP',
      shippingCost: 8.0, freeInstallments: 1, maxInstallments: 3,
      minInstallmentAmount: 10.0,
      genreIds: [g.Drama.id, g.Thriller.id],
      salesCount: 15
    },
    {
      name: 'Spirited Away',
      slug: 'spirited-away-blu-ray',
      description: 'Obra-prima de animação do Studio Ghibli em Blu-ray colecionável.',
      price: 44.9, amount: 16, rating: 5.0,
      sellerId: seller2.id,
      cep: '01310100', city: 'São Paulo', state: 'SP',
      shippingCost: 8.0, freeInstallments: 2, maxInstallments: 4,
      minInstallmentAmount: 11.0, monthlyInterestRate: 0.0199,
      genreIds: [g.Animation.id, g.Adventure.id],
      salesCount: 17
    },
    {
      name: 'Mad Max: Fury Road',
      slug: 'mad-max-fury-road-4k',
      description: 'Ação pós-apocalíptica frenética em UHD 4K.',
      price: 54.9, amount: 11, rating: 4.8,
      sellerId: seller.id,
      cep: '88032000', city: 'Florianópolis', state: 'SC',
      shippingCost: 9.5, freeInstallments: 2, maxInstallments: 5,
      minInstallmentAmount: 12.0, monthlyInterestRate: 0.0199,
      genreIds: [g.Action.id, g['Sci-Fi'].id],
      salesCount: 19
    },
  ];

  async function upsertProduct(
    seed: (typeof gameSeeds)[number],
    mediaTypeId: number,
  ) {
    const { genreIds, ...data } = seed;
    return prisma.product.upsert({
      where: { slug: seed.slug },
      update: {},
      create: {
        ...data,
        mediaTypeId,
        genre: { connect: genreIds.map((id) => ({ id })) },
      },
    });
  }

  const games = await Promise.all(gameSeeds.map((s) => upsertProduct(s, gameType!.id)));
  const movies = await Promise.all(movieSeeds.map((s) => upsertProduct(s, movieType!.id)));

  const allProducts = [...games, ...movies];

  // ──────────────────────────────────────────
  // ProductPhotos (3 por produto)
  // ──────────────────────────────────────────
  for (const p of allProducts) {
    const existing = await prisma.productPhoto.count({ where: { productId: p.id } });
    if (existing > 0) continue;

    await prisma.productPhoto.createMany({
      data: [1, 2, 3].map((n) => ({
        url: `https://placehold.co/600x600/1a1a1a/ffffff?text=${encodeURIComponent(p.name)}+${n}`,
        productId: p.id,
      })),
    });
  }

  // ──────────────────────────────────────────
  // ProductViews
  // ──────────────────────────────────────────
  for (const [i, p] of allProducts.entries()) {
    const existing = await prisma.productView.count({ where: { productId: p.id } });
    if (existing > 0) continue;

    await prisma.productView.createMany({
      data: Array.from({ length: (i % 4) + 1 }, () => ({ productId: p.id })),
    });
  }

  // ──────────────────────────────────────────
  // Reviews (distribuição realista + recálculo do rating do produto)
  // ──────────────────────────────────────────
  const allReviewerCandidates = [buyer, ...reviewers];

  const ratingWeights: number[] = [1, 1, 2, 4, 5];
  const weightedRatings = ratingWeights.flatMap((weight, idx) =>
    Array(weight).fill(idx + 1),
  );

  function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffle<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  for (const [i, product] of allProducts.entries()) {
    const reviewCount = Math.min(
      allReviewerCandidates.length,
      2 + (i % (allReviewerCandidates.length - 1)),
    );

    const candidatesForThisProduct = shuffle(
      allReviewerCandidates.filter((u) => u.id !== product.sellerId),
    ).slice(0, reviewCount);

    for (const user of candidatesForThisProduct) {
      const rating = pickRandom(weightedRatings);

      await prisma.review.upsert({
        where: { userId_productId: { userId: user.id, productId: product.id } },
        update: {},
        create: {
          userId: user.id,
          productId: product.id,
          rating,
        },
      });
    }

    const aggregation = await prisma.review.aggregate({
      where: { productId: product.id },
      _avg: { rating: true },
    });

    const avgRating = aggregation._avg.rating ?? 0;

    await prisma.product.update({
      where: { id: product.id },
      data: { rating: Math.round(avgRating * 10) / 10 }, // arredonda para 1 casa decimal
    });
  }

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
  // Order + OrderItems + Payment (idempotente via confirmationCode)
  // ──────────────────────────────────────────
  const existingPayment = await prisma.payment.findUnique({
    where: { confirmationCode: 'RV-SEED-0001' },
    include: { order: true },
  });

  const order = existingPayment?.order
    ? existingPayment.order
    : await prisma.order.create({
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

  const payment = await prisma.payment.findUnique({ where: { orderId: order.id } });

  // ──────────────────────────────────────────
  // WalletTransactions (idempotente)
  // ──────────────────────────────────────────
  await prisma.walletTransaction.createMany({
    data: [
      { walletId: buyerWallet.id, amount: 500.0, type: 'DEPOSIT', description: 'Depósito inicial de seed' },
      { walletId: sellerWallet.id, amount: 1200.0, type: 'DEPOSIT', description: 'Depósito inicial de seed' },
      { walletId: buyerWallet.id, amount: 79.89, type: 'WITHDRAWAL', description: `Pagamento do pedido ${order.id}`, paymentId: payment!.id },
    ],
    skipDuplicates: true,
  });

  console.log(`Seed concluído: ${allProducts.length} produtos (${games.length} games, ${movies.length} movies).`);

  await prisma.$disconnect();
  await pool.end();
}

void bootstrap();