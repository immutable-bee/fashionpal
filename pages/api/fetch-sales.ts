import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const type = req.query.type;

    const currentDate = new Date().toISOString();

    try {
        let sales;

        if (type === "current") {
            sales = await prisma.sale.findMany({
                where: {
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
                    start_date: {
                        gt: currentDate
                    }
                }
            });
        } else {
            return res.status(400).json({ message: 'Invalid type parameter.' });
        }

        res.status(200).json(sales);
    } catch (error) {
        console.error("Error fetching sales:", error);
        res.status(500).json({ message: error.message });
    }
}
