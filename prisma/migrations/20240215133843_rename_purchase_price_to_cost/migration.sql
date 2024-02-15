/*
  Warnings:

  - You are about to drop the column `purchasePrice` on the `Listing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "purchasePrice",
ADD COLUMN     "cost" DECIMAL(65,30);
