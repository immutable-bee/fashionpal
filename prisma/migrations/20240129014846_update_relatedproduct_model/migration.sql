-- AlterTable
ALTER TABLE "RelatedProduct" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "price" DROP NOT NULL,
ALTER COLUMN "thumbnail" DROP NOT NULL,
ALTER COLUMN "link" DROP NOT NULL;
