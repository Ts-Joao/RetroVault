/*
  Warnings:

  - Added the required column `shipping_cost` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "shipping_cost" DECIMAL(3,2) NOT NULL,
ADD COLUMN     "view_count" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "product_views" (
    "id" TEXT NOT NULL,
    "view_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "product_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_views_product_id_idx" ON "product_views"("product_id");

-- CreateIndex
CREATE INDEX "product_views_view_at_idx" ON "product_views"("view_at");

-- CreateIndex
CREATE INDEX "products_view_count_idx" ON "products"("view_count");

-- AddForeignKey
ALTER TABLE "product_views" ADD CONSTRAINT "product_views_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
