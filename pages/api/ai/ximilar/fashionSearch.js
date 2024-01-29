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
      console.error(
        `HTTP error! status: ${response.status}, text: ${errorBody}`
      );
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

    let relatedProductPromises = topRecords.map((topRecord) => {
      const recordId = topRecord._id.split("---")[1];
      const foundListing = recommendedListings.find(
        (listing) => listing.id === recordId
      );

      if (foundListing) {
        return prisma.relatedProduct.create({
          data: {
            queuedListingId: queuedListing.id,
            price: foundListing.price,
            thumbnail: foundListing.mainImageUrl,
          },
        });
      } else {
        return prisma.relatedProduct.create({
          data: {
            queuedListingId: queuedListing.id,
            price: parseFloat(topRecord.price),
            thumbnail: topRecord._url,
          },
        });
      }
    });

    const relatedProducts = await Promise.all(relatedProductPromises);

    const updateListingStatus = await prisma.queuedListing.update({
      where: { id: listingId },
      data: {
        status: "PROCESSED",
      },
    });

    res.status(200).json({ message: topRecords });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
