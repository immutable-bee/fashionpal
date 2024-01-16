import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../prisma/client";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { nanoid } from "nanoid";

const generateUniqueTinyUrl = async () => {
  let unique = false;
  let tinyUrl: string;
  while (!unique) {
    const hash = nanoid(10);
    tinyUrl = `https://faspl.co/${hash}`;
    const existing = await prisma.listing.findUnique({ where: { tinyUrl } });
    if (!existing) {
      unique = true;
    }
  }
  return tinyUrl;
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // @ts-ignore
  const session = await getServerSession(req, res, authOptions);

  if (req.method === "POST") {
    const listing = req.body.listing;

    if (!listing) {
      return res.status(400).json({ message: "No listing provided!" });
    }

    try {
      let payload: any = {};

      const newTinyUrl = generateUniqueTinyUrl();

      switch (listing.type) {
        case "employee":
          payload = {
            dataSource: listing.employeeName,
            mainImage: listing.mainImage,
            brandImage: listing.brandImage,
            tags: listing.tags,
            status: listing.listType,
            Barcode: listing.barcode,
            tinyUrl: newTinyUrl,
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
            tinyUrl: newTinyUrl,
          };
          break;

        default:
          return res.status(400).json({ message: "Invalid listing type!" });
      }
      const business = await prisma.business.findUnique({
        where: { email: session.user.email },
      });

      if (business) {
        payload.businessId = business.id;
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
