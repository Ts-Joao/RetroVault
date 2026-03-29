/*
  Warnings:

  - You are about to drop the column `freeInstallments` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `maxInstallments` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `minInstallmentAmount` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyInterestRate` on the `products` table. All the data in the column will be lost.
  - Added the required column `min_intallment_amount` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthly_interest_rate` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "freeInstallments",
DROP COLUMN "maxInstallments",
DROP COLUMN "minInstallmentAmount",
DROP COLUMN "monthlyInterestRate",
ADD COLUMN     "free_intalments" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "max_intallments" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "min_intallment_amount" DECIMAL(6,2) NOT NULL,
ADD COLUMN     "monthly_interest_rate" DECIMAL(5,4) NOT NULL;
