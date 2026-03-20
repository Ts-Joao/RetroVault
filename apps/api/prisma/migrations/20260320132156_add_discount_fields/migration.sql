-- AlterTable
ALTER TABLE "products" ADD COLUMN     "discount_end" TIMESTAMP(3),
ADD COLUMN     "discount_price" DECIMAL(5,2),
ADD COLUMN     "discount_start" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "products_discount_end_idx" ON "products"("discount_end");
