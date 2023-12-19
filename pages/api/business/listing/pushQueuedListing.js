import { prisma } from "../../../../db/prismaDB";

const handler = async (req, res) => {
  const { data } = req.body;

  const queuedListing = await prisma.queuedListing.findUnique({
    where: { id: data.id },
    include: {
      queue: true,
    },
  });

  if (!queuedListing) {
    return res.status(404).json({ message: "Queued listing not found" });
  }

  const bucketPath = queuedListing.bucketPath;
  const mainImageUrl = `${process.env.SUPABASE_STORAGE_URL}queued-listings/${bucketPath}/mainImage`;
  const brandImageUrl = `${process.env.SUPABASE_STORAGE_URL}queued-listings/${bucketPath}/brandImage`;

  let categories = [
    queuedListing.topCategory,
    queuedListing.mainCategory,
    queuedListing.subCategory,
  ];
  categories = categories.filter(
    (entry) => entry !== null && entry !== undefined
  );
  const categoriesToCreate = [];
  for (const category of categories) {
    categoriesToCreate.push({
      category: {
        connectOrCreate: {
          where: { name: category },
          create: { name: category },
        },
      },
    });
  }

  try {
    const transactionResult = await prisma.$transaction(async (prisma) => {
      const newListing = await prisma.listing.create({
        data: {
          mainImageUrl,
          brandImageUrl,
          price: data.price,
          tags: queuedListing.tags,
          status: data.status,
          isActive: true,
          daysToExpiry: 7,
          Barcode: "1",
          Business: {
            connect: { id: queuedListing.queue.ownerId },
          },
          categories: {
            create: categoriesToCreate,
          },
        },
      });

      await prisma.queuedListing.delete({
        where: { id: data.id },
      });

      return newListing;
    });

    res.status(200).json(transactionResult);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default handler;
