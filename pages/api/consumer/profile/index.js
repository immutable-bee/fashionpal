import { getServerSession } from "next-auth";
import { prisma } from "../../../../db/prismaDB";
import { authOptions } from "../../auth/[...nextauth]";

const handler = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const consumer = await prisma.consumer.findUnique({
      where: { email: session.user.email },
      include: {
        ThriftList: true,
        emailPreferences: true,
        following: {
          include: {
            business: {
              select: {
                id: true,
                businessName: true,
              },
            },
          },
        },
      },
    });

    if (!consumer) {
      return res.status(404).json({ message: "Consumer record not found" });
    }

    const followingBusinesses = consumer.following.map((follow) => {
      return {
        businessName: follow.business.businessName,
        businessId: follow.business.id,
      };
    });

    const consumerWithFollowing = {
      ...consumer,
      following: followingBusinesses,
    };

    const { ThriftList, following, ...rest } = consumerWithFollowing;

    res.status(200).json({
      ...rest,
      following: followingBusinesses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
