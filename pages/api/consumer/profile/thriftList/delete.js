import { prisma } from "@/db/prismaDB";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";
export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "ID is missing." });
  }
  try {
    await prisma.ThriftList.delete({ where: { id } });

    res.status(200).json({ message: "Thrift Item deleted successfully" });
  } catch (error) {
    console.error("Error Deleting Thrift Item:", error);
    res.status(500).json({ message: error.message });
  }
}
