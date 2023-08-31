import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../prisma/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const tag: { name: string, value: string, listingId: number } = JSON.parse(req.body)
    if (req.method === 'POST') {
        if (!tag.name.length) {
            return res.status(500).json({ message: 'Tag name is required!' })
        }

        if (!tag.value.length) {
            return res.status(500).json({ message: 'Tag value is required!' })
        }

        try {
            const data = await prisma.tag.create({
                data: {
                    name: tag.name,
                    value: tag.value,
                    listingId: tag.listingId
                }
            })
            console.log(data)
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json({ message: 'Error creating new tag!' })
        }
    }
}
