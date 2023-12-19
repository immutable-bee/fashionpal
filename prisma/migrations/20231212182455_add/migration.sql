-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "isSynchedWithSquare" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ReferenceListing" (
    "id" TEXT NOT NULL,
    "bucketPath" TEXT,
    "price" INTEGER,
    "categories" TEXT[],
    "tags" TEXT[],

    CONSTRAINT "ReferenceListing_pkey" PRIMARY KEY ("id")
);
