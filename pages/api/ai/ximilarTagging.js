import { prisma } from "../../../db/prismaDB";

const handler = async (req, res) => {
  const { imageId, url } = req.body;

  const ximilarEndpoint =
    "https://api.ximilar.com/tagging/fashion/v2/detect_tags";

  const ximilarPayload = {
    records: [{ _id: imageId, _url: url }],
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${prcesss.env.XIMILARTOKEN}`,
    },
    body: JSON.stringify(ximilarPayload),
  };

  try {
    const response = await fetch(ximilarEndpoint, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resData = response.json();
    console.log(resData);

    const firstRecord = resData.records[0];
    const firstObject = firstRecord._objects[0];
    const simpleTags = firstObject._tags_simple;
    const topCategory = firstObject._tags_map["Top Category"];
    const mainCategory = firstObject._tags_map["Category"];
    const subCategory = firstObject._tags_map["Subcategory"];

    const updateQueuedListing = await prisma.queuedlisting.update({
      where: { id: imageId },
      data: {
        topCategory,
        mainCategory,
        subCategory,
        tags: simpleTags,
      },
    });

    const productSearch = await fetch("api/ai/serpapi/googleShoppingSearch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ simpleTags }),
    });

    if (!productSearch.ok) {
      return res.status(500).json({ message: "Product search failed" });
    }

    const searchData = productSearch.json();
    return res.status(200).json(searchData);
  } catch (error) {
    console.error(`Ximilar tagging call failed: ${error}`);
    return res.status(500).json({ message: error.message });
  }
};

export default handler;
