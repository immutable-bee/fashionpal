import { prisma } from "../../../../db/prismaDB";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const id = req.query.id;

  try {
    const consumer = await prisma.consumer.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
      },
    });

    if (!consumer) {
      return res.status(404).json({ message: "Consumer record not found" });
    }

    const listingByid = await prisma.listing.findUnique({
      where: {
        id: id,
        isActive: true,
      },
      include: {
        Business: true,
      },
    });

    const following = await prisma.follow.findFirst({
      where: {
        businessId: listingByid.Business.id,
        consumerId: consumer.id,
      },
    });

    let response = listingByid;

    if (following) {
      response = {
        ...response,
        isFollowing: true,
      };
    } else {
      response = {
        ...response,
        isFollowing: false,
      };
    }

    res.status(200).json({ result: response });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default handler;
