import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db/prismaDB";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { id } = req.body;
    // Ensure that id is defined
    if (!id) {
      return res.status(400).json({ message: "ID is missing." });
    }

    try {
      const updatedListing = await prisma.listing.update({
        where: {
          id: id,
        },
        data: req.body,
      });

      res.status(200).json(updatedListing);
    } catch (error) {
      console.error("Error updating listing:", error);
      res.status(500).json({ message: error.message });
    }
  }
}
