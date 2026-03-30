/*
  Warnings:

  - Added the required column `minInstallmentAmount` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthlyInterestRate` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "freeInstallments" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "maxInstallments" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "minInstallmentAmount" DECIMAL(6,2) NOT NULL,
ADD COLUMN     "monthlyInterestRate" DECIMAL(5,4) NOT NULL;
