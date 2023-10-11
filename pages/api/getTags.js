import { ImageAnnotatorClient } from '@google-cloud/vision';
import ntc from 'ntcjs';
import axios from 'axios';

const credentials = JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64').toString());
const client = new ImageAnnotatorClient({ credentials });


const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');





export default async (req, res) => {
    try {
        const base64Image = req.body.image;
        const imageType = req.body.type;

        if (!base64Image || !imageType) {
            return res.status(400).json({ error: "Missing required parameters." });
        }

        const bufferData = Buffer.from(base64Image.split('base64,')[1] || base64Image, 'base64');


        const requestFeatures = imageType === "main" ?
            [{ type: 'TEXT_DETECTION' }, { type: 'IMAGE_PROPERTIES' }, { type: 'LOGO_DETECTION' }, { type: 'LABEL_DETECTION' },
                //  { type: 'WEB_DETECTION' }
            ] :
            [{ type: 'TEXT_DETECTION' }, { type: 'LOGO_DETECTION' }];

        const [result] = await client.annotateImage({ image: { content: bufferData }, features: requestFeatures });

        const tags = [
            ...result.labelAnnotations?.map(label => label.description) || [],
            ...result.textAnnotations?.map(t => t.description) || [],
            ...result.imagePropertiesAnnotation?.dominantColors.colors.map(color => {
                const hexColor = rgbToHex(Math.round(color.color.red), Math.round(color.color.green), Math.round(color.color.blue));
                return ntc.name(hexColor)[1];
            }) || [],
            ...result.logoAnnotations?.map(logo => logo.description) || []
        ];

        res.status(200).json({
            tags: tags,

            // similarProducts: result.webDetection?.webEntities.map(entity => entity.description) || []
        });

    } catch (error) {
        console.error("Error processing image:", error);
        res.status(500).json({ error: error.message });
    }
};

