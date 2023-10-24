import { prisma } from "../../../db/prismaDB";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (
    session.user.email !== "neurogoop@gmail.com" &&
    session.user.email !== "nate@bibliopal.com"
  ) {
    return res.status(403).json({ message: "User does not have permission" });
  }

  console.log(session.user.email);

  try {
    const users = await prisma.business.findMany({});

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default handler;
