/*
  Warnings:

  - Added the required column `link` to the `RelatedProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RelatedProduct" ADD COLUMN     "link" TEXT NOT NULL;
