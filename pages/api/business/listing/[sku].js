import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { prisma } from "../../../../db/prismaDB";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { sku } = req.query;

  if (!sku) {
    return res.status(400).json({ message: "sku is missing." });
  }

  try {
    const business = await prisma.business.findUnique({
      where: { email: session.user.email },
    });
    console.error(business);
    if (!business) {
      return res.status(404).json({ message: "Business record not found" });
    }
    await prisma.listing.updateMany({
      where: {
        Barcode: sku,
      },
      data: { isActive: false },
    });
    console.error("working");
    const listings = await prisma.listing.findMany({
      where: {
        businessId: business.id,
        Barcode: sku,
      },
    });

    res.status(200).json(listings);
  } catch (error) {
    console.error("Error updating listing:", error);
    res.status(500).json({ message: error.message });
  }
}
