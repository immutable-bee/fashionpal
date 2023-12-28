import { prisma } from "@/db/prismaDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const data = req.body;

  try {
    const payload = {};
    payload["description"] = data.detail;
    payload["customerId"] = data.customerId;

    const newThiriftItem = await prisma.ThriftList.create({ data: payload });

    res.status(200).json(newThiriftItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default handler;
