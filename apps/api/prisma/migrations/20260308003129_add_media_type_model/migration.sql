/*
  Warnings:

  - You are about to drop the column `type` on the `products` table. All the data in the column will be lost.
  - Added the required column `media_type_id` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "products_type_idx";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "type",
ADD COLUMN     "media_type_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "media_types" (
    "id" SERIAL NOT NULL,
    "name" "TypeMidia" NOT NULL,

    CONSTRAINT "media_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "media_types_name_key" ON "media_types"("name");

-- CreateIndex
CREATE INDEX "products_media_type_id_idx" ON "products"("media_type_id");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_media_type_id_fkey" FOREIGN KEY ("media_type_id") REFERENCES "media_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
