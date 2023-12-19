-- CreateEnum
CREATE TYPE "RepricingRuleType" AS ENUM ('PREMIUM_ONLY', 'EXCLUDE_PREMIUM', 'INCLUDE_PREMIUM');

-- CreateTable
CREATE TABLE "PricingRule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "listingType" "RepricingRuleType" NOT NULL,
    "adjustPriceBy" INTEGER NOT NULL,
    "cycle" TEXT NOT NULL,
    "roundTo" INTEGER NOT NULL,
    "floorPrice" INTEGER NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "PricingRule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PricingRule" ADD CONSTRAINT "PricingRule_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
