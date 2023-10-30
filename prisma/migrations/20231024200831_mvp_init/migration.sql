/*
  Warnings:

  - You are about to drop the column `current_cycle_uploads` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `membership` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionId` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `upload_credits` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `upload_cycle_start_date` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `alerts_paused` on the `Consumer` table. All the data in the column will be lost.
  - You are about to drop the column `email_alerts_on` on the `Consumer` table. All the data in the column will be lost.
  - You are about to drop the column `isbnAlerts` on the `Consumer` table. All the data in the column will be lost.
  - You are about to drop the column `paid_alerts` on the `Consumer` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionId` on the `Consumer` table. All the data in the column will be lost.
  - You are about to drop the column `tracked_authors` on the `Consumer` table. All the data in the column will be lost.
  - You are about to drop the column `tracked_titles` on the `Consumer` table. All the data in the column will be lost.
  - You are about to drop the column `tracked_zips` on the `Consumer` table. All the data in the column will be lost.
  - You are about to drop the column `auctionFloorPrice` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `auctionMaxPrice` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `auctionTime` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `employeeName` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `floorPrice` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `isAuctioned` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `isLiked` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `isUnLiked` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `listType` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `matches` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `maxPrice` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `subCategoryOne` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `subCategoryTwo` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the `Sale` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UP', 'DOWN');

-- DropForeignKey
ALTER TABLE "Listing" DROP CONSTRAINT "Listing_userId_fkey";

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "current_cycle_uploads",
DROP COLUMN "membership",
DROP COLUMN "subscriptionId",
DROP COLUMN "type",
DROP COLUMN "upload_credits",
DROP COLUMN "upload_cycle_start_date";

-- AlterTable
ALTER TABLE "Consumer" DROP COLUMN "alerts_paused",
DROP COLUMN "email_alerts_on",
DROP COLUMN "isbnAlerts",
DROP COLUMN "paid_alerts",
DROP COLUMN "subscriptionId",
DROP COLUMN "tracked_authors",
DROP COLUMN "tracked_titles",
DROP COLUMN "tracked_zips",
ADD COLUMN     "emailAlertsOn" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "auctionFloorPrice",
DROP COLUMN "auctionMaxPrice",
DROP COLUMN "auctionTime",
DROP COLUMN "category",
DROP COLUMN "employeeName",
DROP COLUMN "floorPrice",
DROP COLUMN "isAuctioned",
DROP COLUMN "isLiked",
DROP COLUMN "isUnLiked",
DROP COLUMN "listType",
DROP COLUMN "matches",
DROP COLUMN "maxPrice",
DROP COLUMN "subCategoryOne",
DROP COLUMN "subCategoryTwo",
DROP COLUMN "type",
DROP COLUMN "userId",
ADD COLUMN     "daysToExpiry" INTEGER NOT NULL DEFAULT 7,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isDisposed" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Sale";

-- DropEnum
DROP TYPE "BUSINESSTYPE";

-- DropEnum
DROP TYPE "MEMBERSHIP";

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "type" "VoteType" NOT NULL DEFAULT 'UP',

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriesOnListings" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "CategoriesOnListings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Consumer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnListings" ADD CONSTRAINT "CategoriesOnListings_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnListings" ADD CONSTRAINT "CategoriesOnListings_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
