/*
  Warnings:

  - You are about to drop the column `isActive` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `photos` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[confirmation_code]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "photos" DROP CONSTRAINT "photos_product_id_fkey";

-- DropForeignKey
ALTER TABLE "photos" DROP CONSTRAINT "photos_user_id_fkey";

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "confirmation_code" TEXT,
ADD COLUMN     "token_expires_at" TIMESTAMP(3),
ALTER COLUMN "paid_at" DROP NOT NULL,
ALTER COLUMN "paid_at" DROP DEFAULT,
ALTER COLUMN "status" SET DEFAULT 'pending',
ALTER COLUMN "payment_method" DROP NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "isActive",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "photos";

-- CreateTable
CREATE TABLE "profile_photos" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "profile_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_photos" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "product_photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profile_photos_user_id_key" ON "profile_photos"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_confirmation_code_key" ON "payments"("confirmation_code");

-- AddForeignKey
ALTER TABLE "profile_photos" ADD CONSTRAINT "profile_photos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_photos" ADD CONSTRAINT "product_photos_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
