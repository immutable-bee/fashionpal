-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "isSyncedWithXimilar" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTagged" BOOLEAN NOT NULL DEFAULT false;
