import { getServerSession } from "next-auth";
import { prisma } from "../../../../db/prismaDB";
import { authOptions } from "../../auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const data = req.body;

  const consumer = await prisma.consumer.findUnique({
    where: { email: session.user.email },
  });

  if (!consumer) {
    return res.status(404).json({ message: "Consumer record not found" });
  }

  try {
    const updatedConsumer = await prisma.consumer.update({
      where: { email: session.user.email },
      data: { ...data },
    });

    return res
      .status(200)
      .json({ message: "Consumer record updatesd: ", updatedConsumer });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default handler;
