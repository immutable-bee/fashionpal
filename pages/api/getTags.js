import { ImageAnnotatorClient } from '@google-cloud/vision';
import ntc from 'ntcjs';

const credentials = JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64, 'base64').toString());
const client = new ImageAnnotatorClient({ credentials });
const rgbToHex = (r, g, b) => {
    return '#' +
        r.toString(16).padStart(2, '0') +
        g.toString(16).padStart(2, '0') +
        b.toString(16).padStart(2, '0');
};

export default async (req, res) => {
    try {
        const base64Image = req.body.image;
        const imageType = req.body.type;

        if (!base64Image || !imageType) {
            return res.status(400).json({ error: "Missing required parameters." });
        }

        let bufferData;
        if (base64Image.includes('base64,')) {
            const imageData = base64Image.split('base64,');
            if (imageData.length !== 2) {
                return res.status(400).json({ error: "Invalid base64 format." });
            }
            bufferData = Buffer.from(imageData[1], 'base64');
        } else {
            bufferData = Buffer.from(base64Image, 'base64');
        }

        let requestFeatures = [];
        if (imageType === "main") {
            requestFeatures = [
                { type: 'TEXT_DETECTION' },
                { type: 'IMAGE_PROPERTIES' },
                { type: 'LOGO_DETECTION' },
                { type: 'LABEL_DETECTION' }
            ];
        } else if (imageType === "brandTag") {
            requestFeatures = [
                { type: 'TEXT_DETECTION' },
                { type: 'LOGO_DETECTION' }
            ];
        }

        const [result] = await client.annotateImage({ image: { content: bufferData }, features: requestFeatures });

        const labelTags = result.labelAnnotations?.map(label => label.description) || [];
        const textTags = result.textAnnotations?.map(t => t.description) || [];

        // Convert RGB values to human-readable color names
        const colorTags = result.imagePropertiesAnnotation?.dominantColors.colors.map(color => {
            const hexColor = rgbToHex(Math.round(color.color.red), Math.round(color.color.green), Math.round(color.color.blue));
            const nameMatch = ntc.name(hexColor);
            return nameMatch[1]; // returning the color name
        }) || [];

        const logoTags = result.logoAnnotations?.map(logo => logo.description) || [];

        const tags = [...labelTags, ...textTags, ...colorTags, ...logoTags];

        res.status(200).json({ tags: tags });

    } catch (error) {
        console.error("Error processing image:", error);
        res.status(500).json({ error: error.message });
    }
};
