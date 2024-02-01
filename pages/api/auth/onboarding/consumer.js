import { prisma } from "../../../../db/prismaDB";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
//import * as notify from "../../notifier/notify";

const handler = async (req, res) => {
  const username = req.body;

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.consumer) {
    return res
      .status(500)
      .json({ message: "User already has an associated consumer account" });
  }

  if (user.business) {
    return res.status(500).json({
      message:
        "Cannot create consumer account, user has an associated business account",
    });
  }

  try {
    const consumer = await prisma.consumer.create({
      data: {
        username: username,
        email: session.user.email,

        emailPreferences: {
          create: {},
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    const onboardingComplete = await prisma.user.update({
      where: { id: user.id },
      data: {
        onboardingComplete: true,
      },
    });

    res.status(200).json({ consumer });
  } catch (err) {
    // notify.error(err);

    res.status(500).json({ message: err.message });
  }
};

export default handler;
