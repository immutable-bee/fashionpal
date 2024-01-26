-- DropForeignKey
ALTER TABLE "EmailPreferences" DROP CONSTRAINT "EmailPreferences_businessId_fkey";

-- DropForeignKey
ALTER TABLE "EmailPreferences" DROP CONSTRAINT "EmailPreferences_consumerId_fkey";

-- AlterTable
ALTER TABLE "EmailPreferences" ALTER COLUMN "businessId" DROP NOT NULL,
ALTER COLUMN "consumerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "EmailPreferences" ADD CONSTRAINT "EmailPreferences_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailPreferences" ADD CONSTRAINT "EmailPreferences_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "Consumer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
