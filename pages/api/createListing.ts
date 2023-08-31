import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../prisma/client';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const listings = req.body.listings;

        if (!Array.isArray(listings) || listings.length === 0) {
            return res.status(400).json({ message: 'No listings provided!' });
        }

        try {

            const createdListings = await Promise.all(listings.map(async ({ mainImage, brandImage, tags }) => {
                // Upload mainImage
                let mainImagePath: any = null;
                let brandImagePath: any = null;
                if (mainImage) {
                    const uploadResponse = await supabase.storage.from('listings').upload(`mainImage-${Date.now()}.png`, Buffer.from(mainImage, 'base64'), {
                        contentType: 'image/png'
                    });
                    if (uploadResponse.error) {
                        throw new Error(uploadResponse.error.message);
                    }
                    const imagePath = uploadResponse.data.path;

                    mainImagePath = {
                        url: `${supabaseUrl}/storage/v1/object/public/${'listings'}/${imagePath}`
                    };

                }
                if (brandImage) {
                    const uploadResponse = await supabase.storage.from('listings').upload(`brandImage-${Date.now()}.png`, Buffer.from(brandImage, 'base64'), {
                        contentType: 'image/png'
                    });
                    if (uploadResponse.error) {
                        throw new Error(uploadResponse.error.message);
                    }
                    const imagePath = uploadResponse.data.path;

                    brandImagePath = {
                        url: `${supabaseUrl}/storage/v1/object/public/${'listings'}/${imagePath}`
                    };

                }
                const payload: any = {
                    mainImage: mainImagePath,
                    brandImage: brandImagePath,
                    tags: {
                        create: tags
                    }
                }

                // Create listing in the database with image URLs and tags
                return prisma.listing.create({
                    data: payload
                });
            }));

            res.status(200).json(createdListings);
        } catch (error) {
            console.error("Error creating listing and tags:", error);
            res.status(500).json({ message: error.message });
        }
    }
}
