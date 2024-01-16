/*
  Warnings:

  - A unique constraint covering the columns `[tinyUrl]` on the table `Listing` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "tinyUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Listing_tinyUrl_key" ON "Listing"("tinyUrl");
