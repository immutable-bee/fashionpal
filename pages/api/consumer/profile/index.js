import { prisma } from "../../../db/prismaDB";

const handler = async (req, res) => {
  try {
    const listings = await prisma.listing.findMany({
      where: { isActive: true },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
