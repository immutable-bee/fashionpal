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
    });

    if (!consumer) {
      return res.status(404).json({ message: "Consumer record not found" });
    }
    const listings = await prisma.consumer.findUnique({
      where: { email: session.user.email },
      include: {
        ThriftList: true,
      },
    });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
