-- CreateTable
CREATE TABLE "Sale" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "discount_amount" DOUBLE PRECISION NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "is_liked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);
