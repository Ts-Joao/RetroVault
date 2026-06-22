import 'dotenv/config'; 
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

// 1. Inicialização do Banco (Agora com a garantia do dotenv rodando antes)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // ──────────────────────────────────────────
  // 2. Recuperação/Criação das dependências necessárias para os produtos
  // ──────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('Admin@123456', 12);

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

  const gameType = await prisma.mediaType.upsert({
    where: { name: 'GAME' },
    update: {},
    create: { name: 'GAME' },
  });

  const movieType = await prisma.mediaType.upsert({
    where: { name: 'MOVIE' },
    update: {},
    create: { name: 'MOVIE' },
  });

  const genreNames = ['Action', 'RPG', 'Horror', 'Adventure', 'Sci-Fi', 'Drama', 'Thriller', 'Comedy', 'Strategy', 'Platformer', 'Fighting', 'Sports', 'Racing', 'Puzzle', 'Animation'];
  
  const g = Object.fromEntries(
    await Promise.all(
      genreNames.map(async (name) => {
        const genre = await prisma.genre.upsert({
          where: { name },
          update: {},
          create: { name },
        });
        return [name, genre];
      }),
    ),
  ) as Record<string, { id: number; name: string }>;

  // ──────────────────────────────────────────
  // Mapa de fotos — 1 por produto
  // ──────────────────────────────────────────
  const productPhotos: Record<string, string> = {
    'zelda-ocarina-of-time-n64':        '/uploads/products/zelda-ocarina-of-time-n64.jpeg',
    'resident-evil-2-ps1':              '/uploads/products/resident-eviel-2.webp',
    'metal-gear-solid-ps1':             '/uploads/products/metal-gear.webp',
    'super-metroid-snes':               '/uploads/products/metroid.jpg',
    'street-fighter-ii-turbo-snes':     '/uploads/products/street-fighter.jpg',
    'chrono-trigger-snes':              '/uploads/products/chrono.jpg',
    'sonic-the-hedgehog-2-mega-drive':  '/uploads/products/sonic.webp',
    'final-fantasy-vii-ps1':            '/uploads/products/final-fantasy.jpg',
    'halo-combat-evolved-xbox':         '/uploads/products/halo.webp',
    'elden-ring-ps5':                   '/uploads/products/elder-ring.jpg',
    '2001-a-space-odyssey-blu-ray':     '/uploads/products/space-odessy.webp',
    'alien-1979-4k':                    '/uploads/products/alien.jpg',
    'the-godfather-trilogy-4k':         '/uploads/products/godfather.webp',
    'akira-1988-blu-ray':               '/uploads/products/akira.webp',
    'blade-runner-final-cut-4k':        '/uploads/products/blade.jpg',
    'spirited-away-blu-ray':            '/uploads/products/spirited.webp',
    'pulp-fiction-4k':                  '/uploads/products/pulp.webp',
    'back-to-the-future-trilogy-4k':    '/uploads/products/back-future.webp',
    'oppenheimer-4k':                   '/uploads/products/opppenheimer.jpg',
    'dune-part-two-4k':                 '/uploads/products/dune.webp',
  };

  // ──────────────────────────────────────────
  // Products — Games (10)
  // ──────────────────────────────────────────
  const gameSeeds = [
    {
      name: 'The Legend of Zelda: Ocarina of Time',
      slug: 'zelda-ocarina-of-time-n64',
      description: 'Cartucho original para Nintendo 64. Considerado um dos maiores jogos de todos os tempos.',
      price: 349.9, amount: 3, rating: 5.0,
      sellerId: seller.id,
      cep: '11665050', city: 'São Sebastião', state: 'SP',
      shippingCost: 12.0, freeInstallments: 6, maxInstallments: 12,
      minInstallmentAmount: 15.0, monthlyInterestRate: 0.0199,
      genreIds: [g.Action.id, g.Adventure.id],
      salesCount: 8,
    },
    {
      name: 'Resident Evil 2',
      slug: 'resident-evil-2-ps1',
      description: 'Mídia física original para PlayStation 1. Survival horror clássico da Capcom — dois discos.',
      price: 129.9, amount: 5, rating: 4.9,
      sellerId: seller2.id,
      cep: '01310100', city: 'São Paulo', state: 'SP',
      shippingCost: 14.0, freeInstallments: 3, maxInstallments: 6,
      minInstallmentAmount: 15.0, monthlyInterestRate: 0.0199,
      genreIds: [g.Horror.id, g.Action.id],
      salesCount: 14,
    },
    {
      name: 'Metal Gear Solid',
      slug: 'metal-gear-solid-ps1',
      description: 'Mídia física original para PS1. A obra que definiu o stealth game moderno.',
      price: 159.9, amount: 4, rating: 4.9,
      sellerId: seller.id,
      cep: '88032000', city: 'Florianópolis', state: 'SC',
      shippingCost: 10.0, freeInstallments: 3, maxInstallments: 8,
      minInstallmentAmount: 15.0, monthlyInterestRate: 0.0199,
      genreIds: [g.Action.id, g.Adventure.id],
      salesCount: 11,
    },
    {
      name: 'Super Metroid',
      slug: 'super-metroid-snes',
      description: 'Cartucho original para Super Nintendo. Pai do gênero Metroidvania — um dos melhores jogos já feitos.',
      price: 499.9, amount: 2, rating: 5.0,
      sellerId: seller2.id,
      cep: '30112000', city: 'Belo Horizonte', state: 'MG',
      shippingCost: 15.0, freeInstallments: 6, maxInstallments: 12,
      minInstallmentAmount: 20.0, monthlyInterestRate: 0.0199,
      genreIds: [g.Action.id, g.Adventure.id],
      salesCount: 4,
    },
    {
      name: 'Street Fighter II Turbo',
      slug: 'street-fighter-ii-turbo-snes',
      description: 'Cartucho original para Super Nintendo. O rei dos jogos de luta em sua versão mais icônica.',
      price: 249.9, amount: 6, rating: 4.8,
      sellerId: seller.id,
      cep: '40301110', city: 'Salvador', state: 'BA',
      shippingCost: 8.0, freeInstallments: 3, maxInstallments: 8,
      minInstallmentAmount: 15.0, monthlyInterestRate: 0.0199,
      genreIds: [g.Fighting.id, g.Action.id],
      salesCount: 9,
    },
    {
      name: 'Chrono Trigger',
      slug: 'chrono-trigger-snes',
      description: 'Cartucho original para Super Nintendo. RPG atemporal da Square — considerado o melhor RPG de todos os tempos.',
      price: 699.9, amount: 1, rating: 5.0,
      sellerId: seller2.id,
      cep: '80010000', city: 'Curitiba', state: 'PR',
      shippingCost: 18.0, freeInstallments: 6, maxInstallments: 12,
      minInstallmentAmount: 25.0, monthlyInterestRate: 0.0199,
      genreIds: [g.RPG.id, g.Adventure.id],
      salesCount: 2,
    },
    {
      name: 'Sonic the Hedgehog 2',
      slug: 'sonic-the-hedgehog-2-mega-drive',
      description: 'Cartucho original para Mega Drive/Genesis. O mascote da Sega em sua aventura mais emblemática.',
      price: 119.9, amount: 8, rating: 4.7,
      sellerId: seller.id,
      cep: '11665050', city: 'São Sebastião', state: 'SP',
      shippingCost: 9.0, freeInstallments: 2, maxInstallments: 6,
      minInstallmentAmount: 12.0, monthlyInterestRate: 0.0199,
      genreIds: [g.Platformer.id, g.Action.id],
      salesCount: 16,
    },
    {
      name: 'Final Fantasy VII',
      slug: 'final-fantasy-vii-ps1',
      description: 'Mídia física original para PlayStation 1 — três discos. O RPG que apresentou uma geração inteira ao gênero.',
      price: 299.9, amount: 3, rating: 5.0,
      sellerId: seller2.id,
      cep: '01310100', city: 'São Paulo', state: 'SP',
      shippingCost: 14.0, freeInstallments: 6, maxInstallments: 12,
      minInstallmentAmount: 15.0, monthlyInterestRate: 0.0199,
      genreIds: [g.RPG.id, g.Adventure.id],
      salesCount: 19,
    },
    {
      name: 'Halo: Combat Evolved',
      slug: 'halo-combat-evolved-xbox',
      description: 'Mídia física original para Xbox. O FPS que definiu os consoles da Microsoft e revolucionou o multiplayer.',
      price: 89.9, amount: 7, rating: 4.8,
      sellerId: seller.id,
      cep: '30112000', city: 'Belo Horizonte', state: 'MG',
      shippingCost: 10.0, freeInstallments: 2, maxInstallments: 6,
      minInstallmentAmount: 12.0, monthlyInterestRate: 0.0199,
      genreIds: [g.Action.id, g['Sci-Fi'].id],
      salesCount: 12,
    },
    {
      name: 'Elden Ring',
      slug: 'elden-ring-ps5',
      description: 'Mídia física para PS5. O RPG de ação da FromSoftware com mundo aberto desenhado por George R.R. Martin.',
      price: 249.9, amount: 10, rating: 4.9,
      sellerId: seller2.id,
      cep: '80010000', city: 'Curitiba', state: 'PR',
      shippingCost: 0, discountPrice: 199.9,
      discountStart: new Date('2026-06-01'), discountEnd: new Date('2026-07-31'),
      freeInstallments: 6, maxInstallments: 12,
      minInstallmentAmount: 15.0, monthlyInterestRate: 0.0199,
      genreIds: [g.RPG.id, g.Action.id],
      salesCount: 25,
    },
  ];

  // ──────────────────────────────────────────
  // Products — Movies (10)
  // ──────────────────────────────────────────
  const movieSeeds = [
    {
      name: '2001: A Space Odyssey',
      slug: '2001-a-space-odyssey-blu-ray',
      description: 'Blu-ray remasterizado 4K. A obra-prima de Stanley Kubrick que redefiniu a ficção científica no cinema.',
      price: 49.9, amount: 14, rating: 5.0,
      sellerId: seller.id,
      cep: '11665050', city: 'São Sebastião', state: 'SP',
      shippingCost: 9.0, freeInstallments: 2, maxInstallments: 4,
      minInstallmentAmount: 12.0, monthlyInterestRate: 0.0199,
      genreIds: [g['Sci-Fi'].id, g.Drama.id],
      salesCount: 8,
    },
    {
      name: 'Alien (1979)',
      slug: 'alien-1979-4k',
      description: 'UHD 4K + Blu-ray. O clássico de terror sci-fi de Ridley Scott com transfer restaurado.',
      price: 69.9, amount: 10, rating: 4.9,
      sellerId: seller2.id,
      cep: '01310100', city: 'São Paulo', state: 'SP',
      shippingCost: 10.0, freeInstallments: 2, maxInstallments: 6,
      minInstallmentAmount: 12.0, monthlyInterestRate: 0.0199,
      genreIds: [g.Horror.id, g['Sci-Fi'].id],
      salesCount: 13,
    },
    {
      name: 'The Godfather Trilogy',
      slug: 'the-godfather-trilogy-4k',
      description: 'Box UHD 4K com os três filmes remasterizados por Francis Ford Coppola. Edição colecionável.',
      price: 149.9, amount: 6, rating: 5.0,
      sellerId: seller.id,
      cep: '88032000', city: 'Florianópolis', state: 'SC',
      shippingCost: 14.0, discountPrice: 119.9,
      discountStart: new Date('2026-06-01'), discountEnd: new Date('2026-08-31'),
      freeInstallments: 4, maxInstallments: 8,
      minInstallmentAmount: 15.0, monthlyInterestRate: 0.0199,
      genreIds: [g.Drama.id, g.Thriller.id],
      salesCount: 7,
    },
    {
      name: 'Akira (1988)',
      slug: 'akira-1988-blu-ray',
      description: 'Blu-ray edição especial. O anime que abriu o Ocidente para a animação japonesa — restauração 4K do negativo original.',
      price: 89.9, amount: 8, rating: 4.9,
      sellerId: seller2.id,
      cep: '80010000', city: 'Curitiba', state: 'PR',
      shippingCost: 11.0, freeInstallments: 2, maxInstallments: 6,
      minInstallmentAmount: 15.0, monthlyInterestRate: 0.0199,
      genreIds: [g.Animation.id, g['Sci-Fi'].id],
      salesCount: 18,
    },
    {
      name: 'Blade Runner: The Final Cut',
      slug: 'blade-runner-final-cut-4k',
      description: 'UHD 4K + Blu-ray. A versão definitiva da obra-prima neo-noir de Ridley Scott.',
      price: 79.9, amount: 9, rating: 4.8,
      sellerId: seller.id,
      cep: '40301110', city: 'Salvador', state: 'BA',
      shippingCost: 10.0, freeInstallments: 2, maxInstallments: 6,
      minInstallmentAmount: 13.0, monthlyInterestRate: 0.0199,
      genreIds: [g['Sci-Fi'].id, g.Thriller.id],
      salesCount: 10,
    },
    {
      name: 'Spirited Away',
      slug: 'spirited-away-blu-ray',
      description: 'Blu-ray colecionável do Studio Ghibli. Vencedor do Oscar de Melhor Animação — edição com livreto.',
      price: 59.9, amount: 12, rating: 5.0,
      sellerId: seller2.id,
      cep: '01310100', city: 'São Paulo', state: 'SP',
      shippingCost: 8.0, freeInstallments: 2, maxInstallments: 4,
      minInstallmentAmount: 12.0, monthlyInterestRate: 0.0199,
      genreIds: [g.Animation.id, g.Adventure.id],
      salesCount: 22,
    },
    {
      name: 'Pulp Fiction',
      slug: 'pulp-fiction-4k',
      description: 'UHD 4K. Tarantino em seu auge — edição comemorativa de 30 anos com extras inéditos.',
      price: 74.9, amount: 11, rating: 4.9,
      sellerId: seller.id,
      cep: '30112000', city: 'Belo Horizonte', state: 'MG',
      shippingCost: 9.0, freeInstallments: 2, maxInstallments: 6,
      minInstallmentAmount: 12.0, monthlyInterestRate: 0.0199,
      genreIds: [g.Drama.id, g.Thriller.id],
      salesCount: 20,
    },
    {
      name: 'Back to the Future Trilogy',
      slug: 'back-to-the-future-trilogy-4k',
      description: 'Box UHD 4K com os três filmes. Transfer supervisionado por Robert Zemeckis — edição definitiva.',
      price: 129.9, amount: 7, rating: 4.9,
      sellerId: seller2.id,
      cep: '40301110', city: 'Salvador', state: 'BA',
      shippingCost: 13.0, freeInstallments: 3, maxInstallments: 8,
      minInstallmentAmount: 15.0, monthlyInterestRate: 0.0199,
      genreIds: [g['Sci-Fi'].id, g.Comedy.id, g.Adventure.id],
      salesCount: 15,
    },
    {
      name: 'Oppenheimer',
      slug: 'oppenheimer-4k',
      description: 'UHD 4K + Blu-ray IMAX. O épico de Christopher Nolan — vencedor de 7 Oscars.',
      price: 99.9, amount: 15, rating: 4.8,
      sellerId: seller.id,
      cep: '11665050', city: 'São Sebastião', state: 'SP',
      shippingCost: 0, discountPrice: 79.9,
      discountStart: new Date('2026-06-15'), discountEnd: new Date('2026-07-15'),
      freeInstallments: 3, maxInstallments: 6,
      minInstallmentAmount: 12.0, monthlyInterestRate: 0.0199,
      genreIds: [g.Drama.id, g.Thriller.id],
      salesCount: 31,
    },
    {
      name: 'Dune: Part Two',
      slug: 'dune-part-two-4k',
      description: 'UHD 4K + Blu-ray. A continuação de Denis Villeneuve — visualmente o mais impressionante da década.',
      price: 89.9, amount: 13, rating: 4.7,
      sellerId: seller2.id,
      cep: '88032000', city: 'Florianópolis', state: 'SC',
      shippingCost: 0, freeInstallments: 3, maxInstallments: 6,
      minInstallmentAmount: 12.0, monthlyInterestRate: 0.0199,
      genreIds: [g['Sci-Fi'].id, g.Adventure.id],
      salesCount: 27,
    },
  ];

  // Função auxiliar de Upsert interna
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

  // Executando as criações
  const games = await Promise.all(gameSeeds.map((s) => upsertProduct(s, gameType!.id)));
  const movies = await Promise.all(movieSeeds.map((s) => upsertProduct(s, movieType!.id)));

  const allProducts = [...games, ...movies];

  // ──────────────────────────────────────────
  // ProductPhotos — Salvando as fotos correspondentes
  // ──────────────────────────────────────────
  for (const p of allProducts) {
    const existing = await prisma.productPhoto.count({ where: { productId: p.id } });
    if (existing > 0) continue;

    await prisma.productPhoto.create({
      data: {
        url: productPhotos[p.slug],
        productId: p.id,
      },
    });
  }
  
  console.log('Seeding concluído com sucesso!');
}

// ──────────────────────────────────────────
// Gatilho de execução e encerramento seguro
// ──────────────────────────────────────────
main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });