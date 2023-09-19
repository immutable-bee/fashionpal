import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const type = req.query.type;
    const customStartDate = req.query.start_date;
    const customEndDate = req.query.end_date;
    const searchName = req.query.name;

    const currentDate = new Date().toISOString();

    try {
        let sales;
        const baseQuery: any = {};

        // If name is provided, add a name filter
        if (searchName) {
            baseQuery.name = {
                contains: searchName,
                mode: 'insensitive'  // Case insensitive search
            };
        }

        if (type === "current") {
            sales = await prisma.sale.findMany({
                where: {
                    ...baseQuery,
                    start_date: {
                        lte: currentDate
                    },
                    end_date: {
                        gte: currentDate
                    }
                }
            });
        } else if (type === "upcoming") {
            sales = await prisma.sale.findMany({
                where: {
                    ...baseQuery,
                    start_date: {
                        gt: currentDate
                    }
                }
            });
        } else if (customStartDate && customEndDate) {
            sales = await prisma.sale.findMany({
                where: {
                    ...baseQuery,
                    start_date: {
                        gte: customStartDate
                    },
                    end_date: {
                        lte: customEndDate
                    }
                }
            });
        } else {
            return res.status(400).json({ message: 'Invalid type parameter or missing date filters.' });
        }

        res.status(200).json(sales);
    } catch (error) {
        console.error("Error fetching sales:", error);
        res.status(500).json({ message: error.message });
    }
}
