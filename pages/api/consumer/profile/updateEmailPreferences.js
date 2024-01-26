import { prisma } from "../../../../db/prismaDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const consumer = await prisma.consumer.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
      },
    });

    if (!consumer) {
      return res.status(404).json({ message: "Consumer record not found" });
    }

    const { emailPreferences } = req.body;

    const data = {
      weeklyEmailReport: emailPreferences.weekly.active,
      receiveTreasures: emailPreferences.weekly.receiveTreasures,
      receiveNewlyListedPremium:
        emailPreferences.weekly.receiveNewlyListedPremium,
      discountEmailReport: emailPreferences.discount.active,
      receiveRecurringDiscounts:
        emailPreferences.discount.receiveRecurringDiscounts,
      receiveOneTimeSpecials: emailPreferences.discount.receiveOneTimeSpecials,
    };

    const updateEmailPreferences = await prisma.emailPreferences.update({
      where: { consumerId: consumer.id },
      data,
    });

    res.status(200).json(updateEmailPreferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
