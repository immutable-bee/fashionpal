import { prisma } from "../../../../db/prismaDB";

const ximilarEndpoint =
  "https://api.ximilar.com/similarity/fashion/v2/visualTagsKNN";
const headers = {
  Authorization: `Token ${process.env.XIMILARTOKEN}`,
  "collection-id": process.env.XIMILAR_COLLECTION_TOKEN,
  "Content-Type": "application/json;charset=UTF-8",
};

const handler = async (req, res) => {
  const { listingId } = req.body;

  try {
    const queuedListing = await prisma.queuedListing.findUnique({
      where: {
        id: listingId,
      },
    });

    if (!queuedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const payload = {
      query_record: {
        _id: queuedListing.id,
        _url: `${process.env.SUPABASE_STORAGE_URL}queued-listings/${queuedListing.bucketPath}mainImage`,
      },
      fields_to_return: ["_url", "_id", "price"],
    };

    const response = await fetch(ximilarEndpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, text: ${errorBody}`
      );
    }

    const resData = await response.json();

    const answerRecords = resData.answer_records;
    const topRecords = answerRecords.slice(0, 3);
    const topRecordIds = topRecords.map((record) => record._id.split("---")[1]);

    const recommendedListings = await prisma.listing.findMany({
      where: {
        id: { in: topRecordIds },
      },
    });

    let relatedProductPromises;

    if (recommendedListings) {
      relatedProductPromises = recommendedListings.map((listing) => {
        return prisma.relatedProduct.create({
          data: {
            queuedListingId: queuedListing.id,
            price: listing.price,
            thumbnail: listing.mainImageUrl,
          },
        });
      });
    } else {
      relatedProductPromises = topRecords.map((record) => {
        return prisma.relatedProduct.create({
          data: {
            queuedListingId: queuedListing.id,
            price: record.price,
            thumbnail: record._url,
          },
        });
      });
    }
    const relatedProducts = await Promise.all(relatedProductPromises);

    res.status(200).json({ message: "Related products added" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
