import { prisma } from "../../../db/prismaDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const consumer = await prisma.consumer.findUnique({
      where: { email: session.user.email },
    });

    if (!consumer) {
      return res.status(500).json({ message: "Consumer record not found." });
    }

    const votes = await prisma.vote.findMany({
      where: {
        userId: consumer.id,
      },
      select: {
        listingId: true,
        type: true,
      },
    });

    return res.status(200).json(votes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default handler;
