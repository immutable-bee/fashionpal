import { prisma } from "../../../db/prismaDB";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { businessId, hash } = req.body;

  try {
    if (!hash) {
      const consumer = await prisma.consumer.findUnique({
        where: {
          email: session.user.email,
        },
      });

      const unfollow = await prisma.follow.deleteMany({
        where: {
          businessId: businessId,
          consumerId: consumer.id,
        },
      });
    } else {
      const tinyUrl = `https://faspl.co/b/${hash}`;
      const business = await prisma.business.findUnique({
        where: {
          tinyUrl: tinyUrl,
        },
        select: {
          id: true,
        },
      });
      const unfollowByUrl = await prisma.follow.deleteMany({
        where: {
          businessId: business.id,
          consumerId: consumer.id,
        },
      });
    }

    res.status(200).json({ message: "Store successfully followed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
