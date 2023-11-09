import { prisma } from "../../../../db/prismaDB";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
//import * as notify from "../../notifier/notify";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const data = req.body;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.business) {
    return res.status(500).json({
      message: "User already has an associated business account",
    });
  }

  if (user.consumer) {
    return res.status(500).json({
      message:
        "Cannot create business account, user has an associated consumer account",
    });
  }

  try {
    const business = await prisma.business.create({
      data: {
        ...data,
        email: session.user.email,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        onboardingComplete: true,
      },
    });

    res.status(200).json({ business });
  } catch (err) {
    // notify.error(err);
    res.status(500).json({ message: err.message });
  }
};

export default handler;
