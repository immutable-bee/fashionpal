-- CreateEnum
CREATE TYPE "RepricingRuleApply" AS ENUM ('ALL', 'MEMBERS_ONLY', 'EXCLUDE_MEMBERS');

-- AlterTable
ALTER TABLE "PricingRule" ADD COLUMN     "appliedTo" "RepricingRuleApply";
