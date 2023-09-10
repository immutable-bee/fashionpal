/*
  Warnings:

  - The `matches` column on the `Listing` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "matches",
ADD COLUMN     "matches" BOOLEAN NOT NULL DEFAULT false;
