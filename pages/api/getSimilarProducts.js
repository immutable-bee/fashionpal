// pages/api/similarProducts.js
import axios from 'axios';

export default async (req, res) => {
    try {
        const { url } = req.query;
        const apiUrl = `https://serpapi.com/search.json?engine=google_lens&url=${url}&api_key=${process.env.GOOGLE_SEARCH_API_KEY}`;
        const response = await axios.get(apiUrl);

        // Check if the response is successful
        if (response.status === 200) {
            // Extract and construct the desired response
            const { visual_matches } = response.data;
            const similarProducts = visual_matches.slice(0, 10).map((product, index) => ({
                id: index + 1,
                name: product.title,
                link: product.link,
                image: product.thumbnail,
                price: product.price ? parseFloat(product.price.value.match(/\d+\.\d+/)[0]) : null,
            }));

            res.status(200).json(similarProducts);
        } else {
            res.status(response.status).json({ error: 'Failed to fetch similar products' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
