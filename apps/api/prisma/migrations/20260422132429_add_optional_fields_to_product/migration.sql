-- AlterTable
ALTER TABLE "products" ALTER COLUMN "rating" DROP NOT NULL,
ALTER COLUMN "shipping_cost" DROP NOT NULL,
ALTER COLUMN "free_intalments" DROP NOT NULL,
ALTER COLUMN "max_intallments" DROP NOT NULL,
ALTER COLUMN "min_intallment_amount" DROP NOT NULL,
ALTER COLUMN "monthly_interest_rate" DROP NOT NULL;
