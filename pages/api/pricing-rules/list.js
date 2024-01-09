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
  const business = await prisma.business.findUnique({
    where: { email: session.user.email },
  });
  const { categoryId, listingType, name } = req.query;

  if (business) {
    try {
      let condition = { ownerId: business.id };
      if (categoryId) {
        condition = { ...condition, categoryId };
      }
      if (listingType) {
        condition = { ...condition, listingType };
      }
      if (name) {
        condition = { ...condition, name: { contains: name } };
      }

      const PricingRules = await prisma.PricingRule.findMany({
        where: condition,
      });
      res.status(200).json(PricingRules);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(403).json({ message: "Business not exist" });
  }
};

export default handler;
