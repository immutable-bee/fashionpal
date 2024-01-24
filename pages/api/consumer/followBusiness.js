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
    const consumer = await prisma.consumer.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!consumer) {
      return res.status(404).json({ message: "Consumer not found" });
    }

    if (!hash) {
      const follow = await prisma.follow.create({
        data: {
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
      const followByUrl = await prisma.follow.create({
        data: {
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
