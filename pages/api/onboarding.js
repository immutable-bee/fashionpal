import { prisma } from "../../db/prismaDB";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import * as notify from "./notifier/notify";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  const { data } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

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
    res
      .status(200)
      .json({ message: `Business record added with id: ${business.id}` });
  } catch (err) {
    notify.error(err);
    res.status(500).json({ Error: err.message });
  }
};

export default handler;
