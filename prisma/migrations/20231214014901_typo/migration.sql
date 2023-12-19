/*
  Warnings:

  - You are about to drop the column `isSynchedWithSquare` on the `Listing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "isSynchedWithSquare",
ADD COLUMN     "isSyncedWithSquare" BOOLEAN NOT NULL DEFAULT false;
