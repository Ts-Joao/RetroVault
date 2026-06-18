-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_order_id_fkey";

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "order_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
