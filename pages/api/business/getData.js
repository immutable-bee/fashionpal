import { prisma } from "../../../db/prismaDB";
import * as notify from "../notifier/notify";

const handler = async (req, res) => {
  const email = req.body;

  try {
    const business = await prisma.business.findUnique({
      where: {
        email: email,
      },
    });

    res.status(200).json(business);
  } catch (error) {
    notify.error(error);
    res.status(500).json({ message: error.message });
  }
};

export default handler;
