-- AlterTable
ALTER TABLE "products" ADD COLUMN     "cep" TEXT NOT NULL DEFAULT '11665-310',
ADD COLUMN     "city" TEXT,
ADD COLUMN     "state" TEXT;
