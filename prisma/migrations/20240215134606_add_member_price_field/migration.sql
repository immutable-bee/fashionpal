/*
  Warnings:

  - You are about to alter the column `discountPrice` on the `Listing` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "memberPrice" DECIMAL(65,30),
ALTER COLUMN "discountPrice" SET DATA TYPE DECIMAL(65,30);
