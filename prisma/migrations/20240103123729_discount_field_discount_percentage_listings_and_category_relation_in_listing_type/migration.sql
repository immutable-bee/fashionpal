/*
  Warnings:

  - You are about to drop the column `category` on the `PricingRule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "discountPercentage" INTEGER,
ADD COLUMN     "discountPrice" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "PricingRule" DROP COLUMN "category",
ADD COLUMN     "categoryId" TEXT;

-- AddForeignKey
ALTER TABLE "PricingRule" ADD CONSTRAINT "PricingRule_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
