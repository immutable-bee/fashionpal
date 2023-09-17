/*
  Warnings:

  - You are about to drop the column `type` on the `Listing` table. All the data in the column will be lost.
  - Added the required column `category` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subCategoryOne` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subCategoryTwo` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "type",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "subCategoryOne" TEXT NOT NULL,
ADD COLUMN     "subCategoryTwo" TEXT NOT NULL;
