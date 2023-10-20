/*
  Warnings:

  - The primary key for the `Listing` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Sale` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- CreateEnum
CREATE TYPE "BUSINESSTYPE" AS ENUM ('CLOTHING', 'FOOTWEAR', 'HATS');

-- CreateEnum
CREATE TYPE "MEMBERSHIP" AS ENUM ('FREE', 'BASIC', 'PREMIUM');

-- AlterTable
ALTER TABLE "Listing" DROP CONSTRAINT "Listing_pkey",
ADD COLUMN     "businessId" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Listing_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Listing_id_seq";

-- AlterTable
ALTER TABLE "Sale" DROP CONSTRAINT "Sale_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Sale_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Sale_id_seq";

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "type" "BUSINESSTYPE" NOT NULL,
    "business_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "business_state" TEXT NOT NULL,
    "business_city" TEXT NOT NULL,
    "business_street" TEXT NOT NULL,
    "business_zip" TEXT NOT NULL,
    "url" TEXT,
    "phone_number" TEXT,
    "membership" "MEMBERSHIP" NOT NULL DEFAULT 'FREE',
    "upload_cycle_start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "current_cycle_uploads" INTEGER NOT NULL DEFAULT 0,
    "upload_credits" INTEGER NOT NULL DEFAULT 0,
    "subscriptionId" TEXT,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consumer" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "alerts_paused" BOOLEAN NOT NULL DEFAULT false,
    "email_alerts_on" BOOLEAN NOT NULL DEFAULT true,
    "tracked_titles" TEXT[],
    "tracked_authors" TEXT[],
    "tracked_zips" TEXT[],
    "isbnAlerts" TEXT[],
    "paid_alerts" INTEGER NOT NULL DEFAULT 25,
    "subscriptionId" TEXT,

    CONSTRAINT "Consumer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_uid_key" ON "Business"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Business_email_key" ON "Business"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Consumer_uid_key" ON "Consumer"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Consumer_email_key" ON "Consumer"("email");

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consumer" ADD CONSTRAINT "Consumer_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;
