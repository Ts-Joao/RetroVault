/*
  Warnings:

  - A unique constraint covering the columns `[confirmation_code]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "confirmation_code" TEXT,
ADD COLUMN     "token_expires_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "payments_confirmation_code_key" ON "payments"("confirmation_code");
