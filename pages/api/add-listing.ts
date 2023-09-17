import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../prisma/client';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const listing = req.body.listing;

        if (!listing) {
            return res.status(400).json({ message: 'No listing provided!' });
        }

        try {
            let mainImagePath: any = null;
            let brandImagePath: any = null;

            if (listing.mainImage) {
                const uploadResponse = await supabase.storage.from('listings').upload(`mainImage-${Date.now()}.png`, Buffer.from(listing.mainImage, 'base64'), {
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

            if (listing.brandImage) {
                const uploadResponse = await supabase.storage.from('listings').upload(`brandImage-${Date.now()}.png`, Buffer.from(listing.brandImage, 'base64'), {
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
                category: listing.category,
                subCategoryOne: listing.subCategoryOne,
                subCategoryTwo: listing.subCategoryTwo,
                mainImage: mainImagePath,
                brandImage: brandImagePath,
                tags: {
                    create: listing.tags.map(x => {
                        return {
                            name: x.name,
                            value: String(x.value)
                        }
                    })
                }
            }


            const createdListing = await prisma.listing.create({
                data: payload
            });

            res.status(200).json(createdListing);
        } catch (error) {
            console.error("Error creating listing and tags:", error);
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
}
