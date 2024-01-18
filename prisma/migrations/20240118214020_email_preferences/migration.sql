/*
  Warnings:

  - You are about to drop the column `discountEmailReport` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `weeklyEmailReport` on the `Business` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Business" DROP COLUMN "discountEmailReport",
DROP COLUMN "weeklyEmailReport";

-- CreateTable
CREATE TABLE "EmailPreferences" (
    "id" TEXT NOT NULL,
    "discountEmailReport" BOOLEAN NOT NULL DEFAULT false,
    "weeklyEmailReport" BOOLEAN NOT NULL DEFAULT false,
    "reveiceTreasures" BOOLEAN NOT NULL DEFAULT false,
    "receiveNewlyListedPremium" BOOLEAN NOT NULL DEFAULT false,
    "receiveRecurringDiscounts" BOOLEAN NOT NULL DEFAULT false,
    "receiveOneTimeSpecials" BOOLEAN NOT NULL DEFAULT false,
    "businessId" TEXT NOT NULL,
    "consumerId" TEXT NOT NULL,

    CONSTRAINT "EmailPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceMetricsVariables" (
    "id" TEXT NOT NULL,
    "sellThroughTarget" DOUBLE PRECISION NOT NULL,
    "aspTarget" DOUBLE PRECISION NOT NULL,
    "businessId" TEXT NOT NULL,

    CONSTRAINT "PerformanceMetricsVariables_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailPreferences_businessId_key" ON "EmailPreferences"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailPreferences_consumerId_key" ON "EmailPreferences"("consumerId");

-- CreateIndex
CREATE UNIQUE INDEX "PerformanceMetricsVariables_businessId_key" ON "PerformanceMetricsVariables"("businessId");

-- AddForeignKey
ALTER TABLE "EmailPreferences" ADD CONSTRAINT "EmailPreferences_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailPreferences" ADD CONSTRAINT "EmailPreferences_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "Consumer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceMetricsVariables" ADD CONSTRAINT "PerformanceMetricsVariables_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
