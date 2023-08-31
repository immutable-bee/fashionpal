import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // Parse query parameters for pagination
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 15;

        try {
            // Calculate the number of records to skip
            const skip = (page - 1) * limit;

            // Fetch limited number of listings with an offset
            const listingsWithTags = await prisma.listing.findMany({
                skip,
                take: limit,
                include: {
                    tags: true,  // Include associated tags for each listing
                },
            });

            // Get the total count of listings
            const total = await prisma.listing.count();

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
