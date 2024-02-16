-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "basePriceVariationId" TEXT,
ADD COLUMN     "memberPriceVariationId" TEXT;

-- AlterTable
ALTER TABLE "PricingRule" ALTER COLUMN "adjustPriceBy" SET DATA TYPE DECIMAL(65,30);
