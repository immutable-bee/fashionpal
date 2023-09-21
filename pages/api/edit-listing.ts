import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const { id, tags } = req.body;
        console.log(req.body)
        console.log(req.body.id)
        console.log(req.body.tags)
        // Ensure that id is defined
        if (!id) {
            return res.status(400).json({ message: 'ID is missing.' });
        }

        // Ensure that tags is an array
        if (!Array.isArray(tags)) {
            return res.status(400).json({ message: 'Tags must be an array.' });
        }

        try {
            const updatedListing = await prisma.listing.update({
                where: {
                    id: id
                },
                data: {
                    tags: tags
                }
            });

            res.status(200).json(updatedListing);
        } catch (error) {
            console.error("Error updating listing:", error);
            res.status(500).json({ message: error.message });
        }
    }
}
