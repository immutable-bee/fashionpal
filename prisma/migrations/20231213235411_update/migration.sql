/*
  Warnings:

  - The values [INCLUDE_PREMIUM] on the enum `RepricingRuleType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RepricingRuleType_new" AS ENUM ('PREMIUM_ONLY', 'EXCLUDE_PREMIUM', 'ALL');
ALTER TABLE "PricingRule" ALTER COLUMN "listingType" TYPE "RepricingRuleType_new" USING ("listingType"::text::"RepricingRuleType_new");
ALTER TYPE "RepricingRuleType" RENAME TO "RepricingRuleType_old";
ALTER TYPE "RepricingRuleType_new" RENAME TO "RepricingRuleType";
DROP TYPE "RepricingRuleType_old";
COMMIT;
