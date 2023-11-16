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

  const categories = [
    queuedListing.topCategory,
    queuedListing.mainCategory,
    queuedListing.subCategory,
  ];

  try {
    const newListing = await prisma.listing.create({
      data: {
        mainImageUrl,
        brandImageUrl,
        price: data.price,
        tags: queuedListing.tags,
        status: data.status,
        isActive: true,
        daysToExpiry: 7,
        Business: {
          connect: { id: queuedListing.queue.ownerId },
        },
        categories: {
          create: [
            {
              category: {
                connectOrCreate: {
                  where: { name: categories[0] },
                  create: { name: categories[0] },
                },
              },
            },
            {
              category: {
                connectOrCreate: {
                  where: { name: categories[1] },
                  create: { name: categories[1] },
                },
              },
            },
            {
              category: {
                connectOrCreate: {
                  where: { name: categories[2] },
                  create: { name: categories[2] },
                },
              },
            },
          ],
        },
      },
    });

    res.status(200).json(newListing);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default handler;