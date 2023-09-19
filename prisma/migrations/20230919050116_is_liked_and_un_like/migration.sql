-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "isLiked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isUnLiked" BOOLEAN NOT NULL DEFAULT false;
