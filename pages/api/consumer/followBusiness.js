import { prisma } from "../../../db/prismaDB";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { businessId } = req.body;

  try {
    const consumer = await prisma.consumer.findUnique({
      where: {
        email: session.user.email,
      },
    });

    const follow = await prisma.follow.create({
      data: {
        businessId: businessId,
        consumerId: consumer.id,
      },
    });

    res.status(200).json({ message: "Store successfully followed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
