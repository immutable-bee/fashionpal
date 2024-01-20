-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UP', 'DOWN');

-- CreateEnum
CREATE TYPE "StatusType" AS ENUM ('SALE', 'DISPOSED', 'DAMAGED', 'SOLD');

-- CreateEnum
CREATE TYPE "QueuedStatus" AS ENUM ('QUEUED', 'PROCESSING', 'PROCESSED');

-- CreateEnum
CREATE TYPE "RepricingRuleType" AS ENUM ('PREMIUM_ONLY', 'EXCLUDE_PREMIUM', 'ALL');

-- CreateEnum
CREATE TYPE "RepricingRuleApply" AS ENUM ('ALL', 'MEMBERS_ONLY', 'EXCLUDE_MEMBERS');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "businessState" TEXT NOT NULL,
    "businessCity" TEXT NOT NULL,
    "businessStreet" TEXT NOT NULL,
    "businessZip" TEXT NOT NULL,
    "url" TEXT,
    "phoneNumber" TEXT,
    "squareAccessToken" TEXT,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consumer" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailAlertsOn" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Consumer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "VoteType" NOT NULL DEFAULT 'UP',

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThriftList" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isChecked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ThriftList_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "mainImage" JSONB,
    "brandImage" JSONB,
    "dataSource" TEXT,
    "price" INTEGER,
    "delivery" TEXT,
    "tags" TEXT[],
    "status" "StatusType" NOT NULL DEFAULT 'SALE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "daysToExpiry" INTEGER NOT NULL DEFAULT 7,
    "businessId" TEXT,
    "Barcode" TEXT NOT NULL,
    "brandImageUrl" TEXT,
    "mainImageUrl" TEXT,
    "isSyncedWithSquare" BOOLEAN NOT NULL DEFAULT false,
    "squareId" TEXT,
    "discountPercentage" INTEGER,
    "discountPrice" DOUBLE PRECISION,
    "isPremiun" BOOLEAN NOT NULL DEFAULT false,
    "tinyUrl" TEXT,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingQueue" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "ListingQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueuedListing" (
    "id" TEXT NOT NULL,
    "queueId" TEXT NOT NULL,
    "topCategory" TEXT,
    "mainCategory" TEXT,
    "subCategory" TEXT,
    "tags" TEXT[],
    "bucketPath" TEXT,
    "status" "QueuedStatus" NOT NULL DEFAULT 'QUEUED',

    CONSTRAINT "QueuedListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelatedProduct" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "queuedListingId" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "RelatedProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferenceListing" (
    "id" TEXT NOT NULL,
    "bucketPath" TEXT,
    "price" INTEGER,
    "categories" TEXT[],
    "tags" TEXT[],

    CONSTRAINT "ReferenceListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingRule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "listingType" "RepricingRuleType" NOT NULL,
    "appliedTo" "RepricingRuleApply",
    "adjustPriceBy" INTEGER NOT NULL,
    "cycle" TEXT NOT NULL,
    "roundTo" DOUBLE PRECISION NOT NULL,
    "floorPrice" INTEGER NOT NULL,
    "ownerId" TEXT NOT NULL,
    "categoryId" TEXT,

    CONSTRAINT "PricingRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiquidationThreshold" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "ownerId" TEXT NOT NULL,
    "categoryId" TEXT,

    CONSTRAINT "LiquidationThreshold_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailPreferences" (
    "id" TEXT NOT NULL,
    "discountEmailReport" BOOLEAN NOT NULL DEFAULT false,
    "weeklyEmailReport" BOOLEAN NOT NULL DEFAULT false,
    "reveiceTreasures" BOOLEAN NOT NULL DEFAULT false,
    "receiveNewlyListedPremium" BOOLEAN NOT NULL DEFAULT false,
    "receiveRecurringDiscounts" BOOLEAN NOT NULL DEFAULT false,
    "receiveOneTimeSpecials" BOOLEAN NOT NULL DEFAULT false,
    "businessId" TEXT NOT NULL,
    "consumerId" TEXT NOT NULL,

    CONSTRAINT "EmailPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformanceMetricsVariables" (
    "id" TEXT NOT NULL,
    "sellThroughTarget" DOUBLE PRECISION NOT NULL,
    "aspTarget" DOUBLE PRECISION NOT NULL,
    "businessId" TEXT NOT NULL,

    CONSTRAINT "PerformanceMetricsVariables_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Business_uid_key" ON "Business"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Business_email_key" ON "Business"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Consumer_uid_key" ON "Consumer"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Consumer_email_key" ON "Consumer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_tinyUrl_key" ON "Listing"("tinyUrl");

-- CreateIndex
CREATE UNIQUE INDEX "ListingQueue_ownerId_key" ON "ListingQueue"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "QueuedListing_bucketPath_key" ON "QueuedListing"("bucketPath");

-- CreateIndex
CREATE UNIQUE INDEX "EmailPreferences_businessId_key" ON "EmailPreferences"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailPreferences_consumerId_key" ON "EmailPreferences"("consumerId");

-- CreateIndex
CREATE UNIQUE INDEX "PerformanceMetricsVariables_businessId_key" ON "PerformanceMetricsVariables"("businessId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consumer" ADD CONSTRAINT "Consumer_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Consumer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThriftList" ADD CONSTRAINT "ThriftList_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Consumer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnListings" ADD CONSTRAINT "CategoriesOnListings_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnListings" ADD CONSTRAINT "CategoriesOnListings_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingQueue" ADD CONSTRAINT "ListingQueue_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueuedListing" ADD CONSTRAINT "QueuedListing_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "ListingQueue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedProduct" ADD CONSTRAINT "RelatedProduct_queuedListingId_fkey" FOREIGN KEY ("queuedListingId") REFERENCES "QueuedListing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricingRule" ADD CONSTRAINT "PricingRule_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricingRule" ADD CONSTRAINT "PricingRule_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiquidationThreshold" ADD CONSTRAINT "LiquidationThreshold_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiquidationThreshold" ADD CONSTRAINT "LiquidationThreshold_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailPreferences" ADD CONSTRAINT "EmailPreferences_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailPreferences" ADD CONSTRAINT "EmailPreferences_consumerId_fkey" FOREIGN KEY ("consumerId") REFERENCES "Consumer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformanceMetricsVariables" ADD CONSTRAINT "PerformanceMetricsVariables_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
