import { prisma } from "@/db/prismaDB";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const Categories = await prisma.Category.findMany({});
    res.status(200).json(Categories.filter((c) => c.name));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
