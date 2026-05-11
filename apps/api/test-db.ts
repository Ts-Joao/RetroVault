import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Fetching products...');
    const products = await prisma.product.findMany();
    console.log('Products fetched successfully:');
    console.dir(products, { depth: null });
}

main()
    .catch((e) => {
        console.error('Error fetching products:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
