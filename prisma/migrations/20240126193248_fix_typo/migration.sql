/*
  Warnings:

  - You are about to drop the column `reveiceTreasures` on the `EmailPreferences` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmailPreferences" DROP COLUMN "reveiceTreasures",
ADD COLUMN     "receiveTreasures" BOOLEAN NOT NULL DEFAULT false;
