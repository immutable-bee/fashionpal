-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "discountEmailReport" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "weeklyEmailReport" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "LiquidationThreshold" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "ownerId" TEXT NOT NULL,
    "categoryId" TEXT,

    CONSTRAINT "LiquidationThreshold_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LiquidationThreshold" ADD CONSTRAINT "LiquidationThreshold_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiquidationThreshold" ADD CONSTRAINT "LiquidationThreshold_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
