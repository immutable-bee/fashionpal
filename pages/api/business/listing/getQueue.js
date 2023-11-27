import { prisma } from "../../../../db/prismaDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const business = await prisma.business.findUnique({
    where: { email: session.user.email },
  });

  const queue = await prisma.listingQueue.findUnique({
    where: { ownerId: business.id },
    include: {
      listings: {
        include: {
          relatedProducts: true,
        },
      },
    },
  });

  res.status(queue);
};

export default handler;
