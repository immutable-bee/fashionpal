/*
  Warnings:

  - Added the required column `isRecurring` to the `PricingRule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ruleType` to the `PricingRule` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RepricingRuleOption" AS ENUM ('SALE', 'STANDARD');

-- AlterTable
ALTER TABLE "PricingRule" ADD COLUMN     "daysOfWeek" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "isRecurring" BOOLEAN NOT NULL,
ADD COLUMN     "ruleType" "RepricingRuleOption" NOT NULL,
ADD COLUMN     "saleEndDate" TIMESTAMP(3),
ADD COLUMN     "saleStartDate" TIMESTAMP(3);
