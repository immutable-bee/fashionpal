import { prisma } from "../../../../db/prismaDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { businessId } = req.query;

  try {
    const consumer = await prisma.consumer.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
      },
    });
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });
    const isFollowing = await prisma.follow.findFirst({
      where: {
        consumerId: consumer.id,
        businessId: business.id,
      },
    });

    const businessWithFollowingStatus = {
      ...business,
      isFollowing: !!isFollowing,
    };

    res.status(200).json(businessWithFollowingStatus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
