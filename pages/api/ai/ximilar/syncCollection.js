import { prisma } from "../../../../db/prismaDB";
import { verifySignature } from "@upstash/qstash/dist/nextjs";

// limit of 10 listings per ximilar insert call

const handler = async (req, res) => {
  const endPoint = "https://api.ximilar.com/similarity/fashion/v2/insert";
  const headers = {
    Authorization: `Token ${process.env.XIMILARTOKEN}`,
    "collection-id": process.env.XIMILAR_COLLECTION_TOKEN,
    "Content-Type": "application/json;charset=UTF-8",
  };

  try {
    const listingsToSync = await prisma.listing.findMany({
      where: { isSyncedWithXimilar: false },
      include: {
        Business: {
          select: {
            id: true,
          },
        },
      },
      take: 10,
    });

    const listingMap = listingsToSync.map((listing) => ({
      _id: `${listing.Business.id}---${listing.id}`,
      _url: listing.mainImageUrl,
      price: listing.price,
    }));

    const payload = {
      fields_to_return: ["_id"],
      records: listingMap,
    };

    const ximilarCall = await fetch(endPoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!ximilarCall.ok) {
      const errorBody = await ximilarCall.text();
      throw new Error(
        `HTTP error! status: ${ximilarCall.status}, body: ${errorBody}`
      );
    }

    res.status(200).json({ message: "Batch synced with collection" });
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json({ message: error.message });
  }
};

export default verifySignature(handler);
