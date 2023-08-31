import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        const { id } = req.query;

        try {
            await prisma.tag.delete({
                where: {
                    id: Number(id)
                },
            });

            res.status(200).json({ message: 'Tag deleted successfully!' });
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    }
}
