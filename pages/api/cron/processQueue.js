import { prisma } from "../../../db/prismaDB";
import { verifySignature } from "@upstash/qstash/dist/nextjs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  const { baseUrl, batchSize } = req.body;
  let queuedListingBatchIds;
  let queuedListingBatch;
  try {
    queuedListingBatch = await prisma.queuedListing.findMany({
      where: { status: "QUEUED" },
      take: batchSize,
    });
    if (queuedListingBatch.length === 0) {
      return res.status(200).json("No listings are currently queued");
    }
    queuedListingBatchIds = queuedListingBatch.map((listing) => listing.id);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch queued listings >>>> " + error.message,
    });
  }
  try {
    const updateBatchStatus = await prisma.queuedListing.updateMany({
      where: { id: { in: queuedListingBatchIds } },
      data: { status: "PROCESSING" },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update queued listings status >>>> " + error.message,
    });
  }

  try {
    const apiCalls = queuedListingBatch.map((listing) => {
      const ximilarReqBody = [
        {
          id: listing.id + "mainImage",
          url: `${process.env.SUPABASE_STORAGE_URL}queued-listings/${listing.bucketPath}mainImage`,
        },
        {
          id: listing.id + "brandImage",
          url: `${process.env.SUPABASE_STORAGE_URL}queued-listings/${listing.bucketPath}brandImage`,
        },
      ];

      const makeXimilarCall = async (listingId) => {
        try {
          const response = await fetch(`${baseUrl}/api/ai/ximilarTagging`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              listingId,
              ximilarReqBody,
              baseUrl,
            }),
          });

          if (!response.ok) {
            throw new Error(`API call failed with status ${response.status}`);
          }
        } catch (error) {
          console.error(`Error in making Ximilar call: ${error.message}`);
          throw error;
        }
      };

      return makeXimilarCall(listing.id);
    });

    await Promise.all(apiCalls);

    res.status(200).json("All AI API calls executed successfully");
  } catch (error) {
    return res.status(500).json({
      message: "AI API call failed >>>> " + error.message,
    });
  }
};

export default verifySignature(handler);
