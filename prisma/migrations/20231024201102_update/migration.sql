/*
  Warnings:

  - You are about to drop the column `business_city` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `business_name` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `business_state` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `business_street` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `business_zip` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `onboarding_complete` on the `User` table. All the data in the column will be lost.
  - Added the required column `businessCity` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessName` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessState` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessStreet` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessZip` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Business" DROP COLUMN "business_city",
DROP COLUMN "business_name",
DROP COLUMN "business_state",
DROP COLUMN "business_street",
DROP COLUMN "business_zip",
DROP COLUMN "phone_number",
ADD COLUMN     "businessCity" TEXT NOT NULL,
ADD COLUMN     "businessName" TEXT NOT NULL,
ADD COLUMN     "businessState" TEXT NOT NULL,
ADD COLUMN     "businessStreet" TEXT NOT NULL,
ADD COLUMN     "businessZip" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "onboarding_complete",
ADD COLUMN     "onboardingComplete" BOOLEAN NOT NULL DEFAULT false;
