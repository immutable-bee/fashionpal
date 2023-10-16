// import axios from 'axios';


// const removeBgApiCall = async (base64) => {
//     try {
//         const formattedBase64 = base64.split(';base64,').pop();

//         const formData = new FormData();
//         formData.append('image_file_b64', formattedBase64);
//         formData.append('size', 'auto');

//         const response = await axios.post(REMOVE_BG_URL, formData, {
//             headers: {
//                 'X-API-Key': REMOVE_BG_API_KEY
//             }
//         });

//         
//         return response.data;
//     } catch (error) {
//         console.error("Error with remove.bg API:", error.response?.data || error.message);
//         throw error;
//     }
// };

// export default async function handler(req, res) {
//     if (req.method !== 'POST') {
//         return res.status(405).end();
//     }

//     try {
//         const base64Image = req.body.image;
//         
//         const bufferData = Buffer.from(base64Image.split('base64,')[1] || base64Image, 'base64');
//         const bgRemovedImage = await removeBgApiCall(bufferData.toString('base64'));

//         res.status(200).json(bgRemovedImage);
//     } catch (error) {
//         console.error("Error in handler:", error.message);
//         res.status(500).json({ error: error.message });
//     }
// }

import axios from 'axios';
import FormData from 'form-data';
import { NextApiRequest, NextApiResponse } from 'next';

const REMOVE_BG_API_KEY = process.env.NEXT_PUBLIC_REMOVE_BG_API_KEY;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).end(); // Method Not Allowed
        return;
    }

    // The frontend will send the image as a blob in the body.
    const imageBuffer = req.body;

    if (!imageBuffer) {
        res.status(400).json({ success: false, error: "No image provided" });
        return;
    }

    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_file', imageBuffer, 'uploaded_image.jpg');

    try {
        const response = await axios({
            method: 'post',
            url: 'https://api.remove.bg/v1.0/removebg',
            data: formData,
            responseType: 'arraybuffer',
            headers: {
                ...formData.getHeaders(),
                'X-Api-Key': REMOVE_BG_API_KEY,
            },
        });

        if (response.status !== 200) {
            res.status(response.status).send(response.statusText);
            return;
        }

        // You can save the image or send it back to the frontend. 
        // For now, I'll send it back to the frontend as a blob.
        res.setHeader('Content-Type', 'image/png');
        res.status(200).send(response.data);
    } catch (error) {
        if (error.response && error.response.data) {
            console.error('API responded with:', error.response.data);  // For logging
            res.status(500).json({ success: false, error: error.response.data.message || 'Unknown error' });
        } else {
            res.status(500).json({ success: false, error: error.message });
        }
    }

};

