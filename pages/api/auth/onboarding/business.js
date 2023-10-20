import { prisma } from "../../../../db/prismaDB";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import * as notify from "../../notifier/notify";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  const data = req.body;

  console.log(data);

  try {
    const business = await prisma.business.create({
      data: {
        ...data,
        email: session.user.email,
        user: {
          connect: {
            email: session.user.email,
          },
        },
      },
    });
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        onboarding_complete: true,
      },
    });

    res.status(200).json({ business });
  } catch (err) {
    notify.error(err);
    res.status(500).json({ message: err.message });
  }
};

export default handler;
