import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db/prismaDB";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const id = req.query.id as string;

    try {
      const listingByid = await prisma.listing.findUnique({
        where: {
          id: id,
          isActive: true,
        },
      });

      if (!listingByid) {
        return res.status(404).json({ message: "Listing not found" });
      }

      res.status(200).json({
        result: listingByid,
      });
    } catch (error) {
      console.error("Error fetching listing by barcode:", error);
      res.status(500).json({ message: error.message });
    }
  }
}
