import { ImageAnnotatorClient } from '@google-cloud/vision';

const client = new ImageAnnotatorClient();

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
            // If the base64 string doesn't have the prefix, assume it's raw base64 data.
            bufferData = Buffer.from(base64Image, 'base64');
        }

        let tags = [];

        if (imageType === "main") {
            // Using Google Vision Label Detection
            const [result] = await client.labelDetection(bufferData);
            tags = result.labelAnnotations.map(label => label.description);
        } else if (imageType === "brandTag") {
            // Using Google Vision's Text Detection
            const [result] = await client.textDetection(bufferData);
            const detections = result.textAnnotations;
            tags = detections.map(text => text.description);
        }

        res.status(200).json({ tags: tags });

    } catch (error) {
        console.error("Error processing image:", error);
        res.status(500).json({ error: error.message });
    }
};
