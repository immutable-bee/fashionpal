import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma/client";
import { supabase } from "@/supabase/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { id } = req.query;

    try {
      // Step 1: Fetch the listing to get image URLs
      const listing = await prisma.listing.findUnique({
        where: { id: Number(id) },
      });

      if (!listing) {
        return res.status(404).json({ message: "Listing not found!" });
      }

      // Step 2: Delete images from Supabase storage
      const { mainImage, brandImage } = listing;
      console.log(mainImage);
      if (mainImage && (mainImage as any).url) {
        const imagePath = (mainImage as any).url.split("/").pop();
        console.log(imagePath);
        await supabase.storage.from("listings").remove([imagePath]);
      }

      if (brandImage && (brandImage as any).url) {
        const imagePath = (brandImage as any).url.split("/").pop();
        await supabase.storage.from("listings").remove([imagePath]);
      }

      await prisma.listing.delete({
        where: {
          id: Number(id),
        },
      });

      res
        .status(200)
        .json({ message: "Listing and images deleted successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json(error);
    }
  }
}
