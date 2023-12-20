import { prisma } from "@/db/prismaDB";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { RepricingRuleType } from "@prisma/client";

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

    const business = await prisma.business.findUnique({
      where: { email: session.user.email },
    });

    if (business) {
      payload["ownerId"] = business.id;
    }
    payload["name"] = data.name;
    payload["category"] = data.category;
    payload["listingType"] = data.listingType;
    payload["adjustPriceBy"] = parseFloat(data.adjustPriceBy);
    payload["cycle"] = data.cycle;
    payload["roundTo"] = parseFloat(data.roundTo);
    payload["floorPrice"] = parseFloat(data.floorPrice);

    const newListing = await prisma.PricingRule.create({ data: payload });

    res.status(200).json(newListing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default handler;
