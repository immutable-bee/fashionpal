/*
  Warnings:

  - A unique constraint covering the columns `[tinyUrl]` on the table `Business` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "squareRefreshToken" TEXT,
ADD COLUMN     "squareTokenIssueDate" TIMESTAMP(3),
ADD COLUMN     "tinyUrl" TEXT;

-- CreateTable
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "consumerId" TEXT NOT NULL,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Business_tinyUrl_key" ON "Business"("tinyUrl");

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "Consumer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
