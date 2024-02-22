import { prisma } from "../../../../db/prismaDB";
import { nanoid } from "nanoid";

const generateUniqueTinyUrl = async () => {
  let unique = false;
  let tinyUrl;
  while (!unique) {
    const hash = nanoid(10);
    tinyUrl = `https://faspl.co/${hash}`;
    const existing = await prisma.listing.findUnique({ where: { tinyUrl } });
    if (!existing) {
      unique = true;
    }
  }
  return tinyUrl;
};

const handler = async (req, res) => {
  const { data } = req.body;

  let newListingSku;

  try {
    // Start the transaction
    await prisma.$executeRaw`BEGIN`;

    try {
      const queuedListing = await prisma.queuedListing.findUnique({
        where: { id: data.id },
        include: {
          queue: true,
          relatedProducts: true,
        },
      });

      if (!queuedListing) {
        await prisma.$executeRaw`ROLLBACK`;
        return res.status(404).json({ message: "Queued listing not found" });
      }

      // Handle related products if needed
      await prisma.relatedProduct.deleteMany({
        where: {
          queuedListingId: queuedListing.id,
        },
      });

      const bucketPath = queuedListing.bucketPath;
      const mainImageUrl = `${process.env.SUPABASE_STORAGE_URL}queued-listings/${bucketPath}/mainImage`;
      const brandImageUrl = `${process.env.SUPABASE_STORAGE_URL}queued-listings/${bucketPath}/brandImage`;

      let categories = [
        queuedListing.topCategory,
        queuedListing.mainCategory,
        queuedListing.subCategory,
      ];
      const categoryPath = queuedListing.categoryPath;

      categories = categories.filter(
        (entry) => entry !== null && entry !== undefined
      );
      const categoryToCreate = {
        category: {
          connectOrCreate: {
            where: { taxonomicPath: categoryPath },
            create: {
              taxonomicPath: categoryPath,
              top: categories[0],
              name: categories[2] ? categories[2] : categories[1],
              sub: categories[2] ? categories[2] : null,
            },
          },
        },
      };

      const newTinyUrl = await generateUniqueTinyUrl();

      const timestampSku = new Date()
        .toISOString()
        .replace(/[-T:]/g, "")
        .slice(0, 14);

      // including suffix nanoid to prevent edge case of multiple listings
      //uploaded in the same second having duplicate sku
      newListingSku = timestampSku + nanoid(3);

      const newListing = await prisma.listing.create({
        data: {
          mainImageUrl,
          brandImageUrl,
          price: data.price,
          tags: queuedListing.tags,
          status: data.status,
          isActive: true,
          daysToExpiry: 7,
          Barcode: newListingSku,
          tinyUrl: newTinyUrl,
          Business: {
            connect: { id: queuedListing.queue.ownerId },
          },
          categories: {
            create: categoryToCreate,
          },
        },
      });

      await prisma.queuedListing.delete({
        where: { id: data.id },
      });

      // Commit the transaction
      await prisma.$executeRaw`COMMIT`;

      return res.status(200).json({ message: "Successfully deleted" });
    } catch (error) {
      // Rollback the transaction in case of an error
      await prisma.$executeRaw`ROLLBACK`;
      console.error("Inner Transaction Error:", error);
      throw error; // Rethrow the error to ensure the outer transaction is rolled back
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Outer Transaction Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export default handler;
