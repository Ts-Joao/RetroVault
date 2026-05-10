-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "paid_at" DROP NOT NULL,
ALTER COLUMN "paid_at" DROP DEFAULT,
ALTER COLUMN "payment_method" DROP NOT NULL;
