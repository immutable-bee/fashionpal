-- CreateTable
CREATE TABLE "ThriftList" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "ThriftList_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ThriftList" ADD CONSTRAINT "ThriftList_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Consumer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
