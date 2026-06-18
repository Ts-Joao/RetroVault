/*
  Warnings:

  - A unique constraint covering the columns `[wallet_top_up_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[wallet_transaction_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[payment_id]` on the table `wallet_transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "wallet_top_up_id" TEXT,
ADD COLUMN     "wallet_transaction_id" TEXT;

-- CreateTable
CREATE TABLE "wallet_payments" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "type" "TypeWalletTransaction" NOT NULL,
    "wallet_id" TEXT NOT NULL,
    "payment_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmed_at" TIMESTAMP(3),
    "confirmation_token" TEXT,
    "token_expired_at" TIMESTAMP(3),

    CONSTRAINT "wallet_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wallet_payments_payment_id_key" ON "wallet_payments"("payment_id");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_payments_confirmation_token_key" ON "wallet_payments"("confirmation_token");

-- CreateIndex
CREATE UNIQUE INDEX "payments_wallet_top_up_id_key" ON "payments"("wallet_top_up_id");

-- CreateIndex
CREATE UNIQUE INDEX "payments_wallet_transaction_id_key" ON "payments"("wallet_transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_transactions_payment_id_key" ON "wallet_transactions"("payment_id");

-- AddForeignKey
ALTER TABLE "wallet_payments" ADD CONSTRAINT "wallet_payments_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_payments" ADD CONSTRAINT "wallet_payments_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
