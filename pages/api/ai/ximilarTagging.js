import { prisma } from "../../../db/prismaDB";

const handler = async (req, res) => {
  const { queuedListingId, ximilarReqBody, baseUrl } = req.body;

  const ximilarEndpoint =
    "https://api.ximilar.com/tagging/fashion/v2/detect_tags";

  const ximilarPayload = {
    records: ximilarReqBody.map((image) => ({
      _id: image.id,
      _url: image.url,
    })),
    aggregate_labels: true,
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${process.env.XIMILARTOKEN}`,
    },
    body: JSON.stringify(ximilarPayload),
  };

  try {
    const response = await fetch(ximilarEndpoint, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resData = await response.json();

    const firstRecord = resData.records[0];
    const firstObject = firstRecord._objects[0];
    const simpleTags = firstObject._tags_simple;
    const topCategory = firstObject._tags_map["Top Category"];
    const mainCategory = firstObject._tags_map["Category"];
    const subCategory = firstObject._tags_map["Subcategory"];

    const updateQueuedListing = await prisma.queuedListing.update({
      where: { id: queuedListingId },
      data: {
        topCategory,
        mainCategory,
        subCategory,
        tags: simpleTags,
      },
    });

    console.log(queuedListingId);
    const productSearch = await fetch(
      `${baseUrl}/api/ai/serpapi/googleShoppingSearch`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ simpleTags, queuedListingId }),
      }
    );

    if (!productSearch.ok) {
      return res.status(500).json({ message: "Product search failed" });
    }

    return res.status(200).json("Listing successfully tagged");
  } catch (error) {
    console.error(`Ximilar tagging call failed: ${error}`);
    return res.status(500).json({ message: error.message });
  }
};

export default handler;
