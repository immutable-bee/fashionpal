-- CreateTable
CREATE TABLE "ListingQueue" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "ListingQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueuedListing" (
    "id" TEXT NOT NULL,
    "url" TEXT,
    "queueId" TEXT NOT NULL,
    "topCategory" TEXT,
    "mainCategory" TEXT,
    "subCategory" TEXT,
    "tags" TEXT[],
    "relatedPrices" TEXT[],

    CONSTRAINT "QueuedListing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ListingQueue_ownerId_key" ON "ListingQueue"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "QueuedListing_url_key" ON "QueuedListing"("url");

-- AddForeignKey
ALTER TABLE "ListingQueue" ADD CONSTRAINT "ListingQueue_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueuedListing" ADD CONSTRAINT "QueuedListing_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "ListingQueue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
