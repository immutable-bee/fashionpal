import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // Parse query parameters for pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 15;
    const searchText = req.query.searchText as string;
    const apparel = req.query.apparel as string;
    const status = req.query.status as string;
    const matches = req.query.matches as string;
    const size = req.query.size as string;

    try {
      const skip = (page - 1) * limit;
      const filters = [];
      if (searchText) {
        filters.push(searchText);
      }

      if (size) {
        filters.push(size);
      }
      const whereClause: any =
        filters.length > 0
          ? {
              tags: {
                hasSome: filters,
              },
            }
          : {};

      if (apparel) {
        whereClause.categories = {
          some: { category: { name: apparel } },
        };
      }
      if (status) {
        whereClause.status = status;
      }
      if (matches) {
        whereClause.matches = true;
      }
      const listingsWithTags = await prisma.listing.findMany({
        skip,
        take: limit,
        where: whereClause,
      });

      // Get the total count of listings with filtering
      const total = await prisma.listing.count({
        where: whereClause,
      });

      // Calculate the total number of pages
      const totalPages = Math.ceil(total / limit);

      // Create the pagination object
      const pagination = {
        total,
        previous_page: page > 1 ? page - 1 : null,
        current_page: page,
        next_page: page < totalPages ? page + 1 : null,
        items: listingsWithTags.length,
        total_pages: totalPages,
        has_prev_page: page > 1,
        limit_per_page: limit,
        has_next_page: page < totalPages,
      };

      res.status(200).json({
        results: listingsWithTags,
        pagination,
      });
    } catch (error) {
      console.error("Error fetching listings and tags:", error);
      res.status(500).json({ message: error.message });
    }
  }
}