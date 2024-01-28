import { prisma } from "../../../../db/prismaDB";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const business = await prisma.business.findUnique({
      where: { email: session.user.email },
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    const idToDelete = req.body;

    const deleteThreshold = await prisma.liquidationThreshold.delete({
      where: { id: idToDelete },
    });

    return res.status(200).json(deleteThreshold);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default handler;
