import { getJson } from "serpapi";

const handler = async (req, res) => {
  try {
    const { simpleTags } = req.body;
    const apiQuery = simpleTags.join(" ");

    getJson(
      {
        engine: "google_shopping",
        q: apiQuery,
        api_key: process.env.SERPAPI_TOKEN,
      },
      (json) => {
        if (!json || !Array.isArray(json["shopping_results"])) {
          return res
            .status(500)
            .json({ error: "Invalid response from the API" });
        }

        const searchResults = json["shopping_results"];
        const topResults =
          searchResults.length > 5 ? searchResults.slice(0, 5) : searchResults;
        const simplifiedResults = topResults.map((item) => ({
          title: item.title,
          price: item.price,
          thumbnail: item.thumbnail,
        }));

        return res.status(200).json(simplifiedResults);
      }
    );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default handler;
