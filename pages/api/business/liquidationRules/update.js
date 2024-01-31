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

    const categoriesWithThresholds = req.body;
    const categoryNames = categoriesWithThresholds.map((ct) => ct.name);

    const existingThresholds = await prisma.liquidationThreshold.findMany({
      where: {
        name: { in: categoryNames },
        ownerId: business.id,
      },
    });

    await Promise.all(
      categoriesWithThresholds.map(async (categoryThreshold) => {
        const existingThreshold = existingThresholds.find(
          (et) => et.name === categoryThreshold.name
        );
        if (existingThreshold) {
          return prisma.liquidationThreshold.update({
            where: { id: existingThreshold.id },
            data: { days: categoryThreshold.days },
          });
        } else {
          return prisma.liquidationThreshold.create({
            data: {
              name: categoryThreshold.name,
              days: categoryThreshold.days,
              ownerId: business.id,
            },
          });
        }
      })
    );
    res.status(200).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default handler;
