import { prisma } from "../../../db/prismaDB";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { businessId } = req.body;

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

  res.status(200).json({ message: "Store successfully followed" });
};

export default handler;
