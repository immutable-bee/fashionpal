import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma/client";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const listing = req.body.listing;

    if (!listing) {
      return res.status(400).json({ message: "No listing provided!" });
    }

    try {
      let payload: any = {};

      switch (listing.type) {
        case "simple":
          payload = {
            type: "simple",
            mainImage: listing.mainImage,
            brandImage: listing.brandImage,
            category: listing.category,
            subCategoryOne: listing.subCategoryOne,
            subCategoryTwo: listing.subCategoryTwo,
            tags: listing.tags,
          };
          break;

        case "employee":
          payload = {
            type: "employee",
            employeeName: listing.employeeName,
            listType: listing.listType,
            mainImage: listing.mainImage,
            brandImage: listing.brandImage,
            tags: listing.tags,
          };
          break;

        case "admin":
          payload = {
            type: "admin",
            category: listing.category,
            floorPrice: listing.floorPrice,
            maxPrice: listing.maxPrice,
            dataSource: listing.dataSource,
            isAuctioned: listing.isAuctioned,
            price: listing.price,
            listType: listing.listType,
            auctionTime: listing.auctionTime,
            auctionFloorPrice: listing.auctionFloorPrice,
            auctionMaxPrice: listing.auctionMaxPrice,
            delivery: listing.delivery,
            mainImage: listing.mainImage,
            brandImage: listing.brandImage,
            tags: listing.tags,
          };
          break;

        default:
          return res.status(400).json({ message: "Invalid listing type!" });
      }

      const createdListing = await prisma.listing.create({
        data: payload,
      });

      res.status(200).json(createdListing);
    } catch (error) {
      console.error("Error creating listing and tags:", error);
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
