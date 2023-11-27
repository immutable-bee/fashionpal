/*
  Warnings:

  - You are about to drop the column `relatedPrices` on the `QueuedListing` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "QueuedStatus" AS ENUM ('QUEUED', 'PROCESSING', 'PROCESSED');

-- AlterTable
ALTER TABLE "QueuedListing" DROP COLUMN "relatedPrices",
ADD COLUMN     "status" "QueuedStatus" NOT NULL DEFAULT 'QUEUED';

-- CreateTable
CREATE TABLE "RelatedProduct" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "queuedListingId" TEXT NOT NULL,

    CONSTRAINT "RelatedProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RelatedProduct" ADD CONSTRAINT "RelatedProduct_queuedListingId_fkey" FOREIGN KEY ("queuedListingId") REFERENCES "QueuedListing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
