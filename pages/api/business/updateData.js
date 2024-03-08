import { prisma } from "@/db/prismaDB";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { AES } from "crypto-ts";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { data } = req.body;
  console.log(req.body);
  const business = await prisma.business.findUnique({
    where: { email: session.user.email },
  });

  if (!business) {
    return res.status(404).json({ message: "Business record not found" });
  }
  console.log(data);

  try {
    const updatedBusiness = await prisma.business.update({
      where: { email: session.user.email },
      data: data,
    });

    return res
      .status(200)
      .json({ message: "Business record updatesd: ", updatedBusiness });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default handler;
