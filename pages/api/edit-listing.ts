import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const id = req.body.id;

        try {
            const updatedListing = await prisma.listing.update({
                where: {
                    id: id
                },
                data: {
                    matches: true
                }
            });

            res.status(200).json(updatedListing);
        } catch (error) {
            console.error("Error updating listing:", error);
            res.status(500).json({ message: error.message });
        }
    }
}
