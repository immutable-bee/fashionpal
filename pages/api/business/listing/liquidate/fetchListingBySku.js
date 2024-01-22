import { prisma } from "../../../../../db/prismaDB";
import { authOptions } from "../../../auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const sku = req.body;

  try {
    const business = await prisma.business.findUnique({
      where: { email: session.user.email },
    });

    const listing = await prisma.listing.findMany({
      where: {
        businessId: business.id,
        Barcode: sku,
      },
      select: {
        Barcode: true,
        price: true,
        createdAt: true,
      },
    });

    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
