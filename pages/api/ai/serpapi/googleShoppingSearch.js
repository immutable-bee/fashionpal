import { getJson } from "serpapi";
import { prisma } from "../../../../db/prismaDB";

const handler = async (req, res) => {
  try {
    const { simpleTags, queuedListingId } = req.body;
    console.log(req.body);
    const apiQuery = simpleTags.join(" ");

    getJson(
      {
        engine: "google_shopping",
        q: apiQuery,
        api_key: process.env.SERPAPI_TOKEN,
      },
      async (json) => {
        if (!json || !Array.isArray(json["shopping_results"])) {
          return res
            .status(500)
            .json({ error: "Invalid response from the API" });
        }

        const searchResults = json["shopping_results"];
        const topResults =
          searchResults.length > 5 ? searchResults.slice(0, 5) : searchResults;

        try {
          await Promise.all(
            topResults.map(async (item) => {
              await prisma.relatedProduct.create({
                data: {
                  title: item.title,
                  price: item.extracted_price,
                  thumbnail: item.thumbnail,
                  link: item.link,
                  queuedListingId,
                },
              });
            })
          );

          const updateListingStatus = await prisma.queuedListing.update({
            where: { id: queuedListingId },
            data: {
              status: "PROCESSED",
            },
          });

          return res
            .status(200)
            .json({ message: "Related products updated successfully" });
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default handler;
