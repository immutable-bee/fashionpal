import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db/prismaDB";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { id }: any = req.query;

    try {
      const listing = await prisma.listing.findUnique({
        where: { id: id },
      });

      if (!listing) {
        return res.status(404).json({ message: "Listing not found!" });
      }

      await prisma.listing.update({
        where: {
          id: id,
        },
        data: { isActive: false },
      });

      res.status(200).json({ message: "Listing deleted successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }
}
