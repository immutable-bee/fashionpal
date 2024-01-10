import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const barcode = req.query.barcode as string;

        try {
            const listingByBarcode = await prisma.listing.findUnique({
                where: {
                    Barcode: barcode,
                    isActive: true,
                },
            });

            if (!listingByBarcode) {
                return res.status(404).json({ message: "Listing not found" });
            }

            res.status(200).json({
                result: listingByBarcode,
            });
        } catch (error) {
            console.error("Error fetching listing by barcode:", error);
            res.status(500).json({ message: error.message });
        }
    }
}
