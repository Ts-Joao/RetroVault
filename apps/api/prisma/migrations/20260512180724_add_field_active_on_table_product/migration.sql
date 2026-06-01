/*
  Warnings:

  - You are about to drop the column `confirmation_code` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `token_expires_at` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `product_photos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profile_photos` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `paid_at` on table `payments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `payment_method` on table `payments` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "product_photos" DROP CONSTRAINT "product_photos_product_id_fkey";

-- DropForeignKey
ALTER TABLE "profile_photos" DROP CONSTRAINT "profile_photos_user_id_fkey";

-- DropIndex
DROP INDEX "payments_confirmation_code_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "confirmation_code",
DROP COLUMN "token_expires_at",
ALTER COLUMN "paid_at" SET NOT NULL,
ALTER COLUMN "paid_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "payment_method" SET NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "is_active",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "product_photos";

-- DropTable
DROP TABLE "profile_photos";

-- CreateTable
CREATE TABLE "photos" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "photos_user_id_key" ON "photos"("user_id");

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
