/*
  Warnings:

  - You are about to drop the column `item` on the `Sale` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "item",
ADD COLUMN     "items" TEXT[];
