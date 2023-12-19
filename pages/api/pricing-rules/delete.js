import { prisma } from "@/db/prismaDB";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { RepricingRuleType } from "@prisma/client";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { id } = req.body;
  // Ensure that id is defined
  if (!id) {
    return res.status(400).json({ message: "ID is missing." });
  }
  try {
    await prisma.PricingRule.delete({ where: { id } });

    res.status(200).json({ message: "Price rule deleted successfully" });
  } catch (error) {
    console.error("Error updating Price Rule:", error);
    res.status(500).json({ message: error.message });
  }
}
