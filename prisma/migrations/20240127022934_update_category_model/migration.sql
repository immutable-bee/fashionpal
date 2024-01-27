/*
  Warnings:

  - A unique constraint covering the columns `[taxonomicPath]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "sub" TEXT,
ADD COLUMN     "taxonomicPath" TEXT,
ADD COLUMN     "top" TEXT,
ALTER COLUMN "name" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_taxonomicPath_key" ON "Category"("taxonomicPath");
