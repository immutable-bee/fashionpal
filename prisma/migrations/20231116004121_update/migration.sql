/*
  Warnings:

  - You are about to drop the column `url` on the `QueuedListing` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bucketPath]` on the table `QueuedListing` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "QueuedListing_url_key";

-- AlterTable
ALTER TABLE "QueuedListing" DROP COLUMN "url",
ADD COLUMN     "bucketPath" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "QueuedListing_bucketPath_key" ON "QueuedListing"("bucketPath");
