import { prisma } from "../../../db/prismaDB";
import { verifySignature } from "@upstash/qstash/dist/nextjs";
import { supabase } from "../../../supabase/client";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  const { baseUrl, batchSize } = req.query;
  let queuedListingBatchIds;
  let queuedListingBatch;
  try {
    queuedListingBatch = await prisma.queuedListing.findMany({
      where: { status: "QUEUED" },
      take: parseInt(batchSize),
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
    const apiCalls = queuedListingBatch.map(async (listing) => {
      const { data: fileList, error } = await supabase.storage
        .from("queued-listings")
        .list(listing.bucketPath);

      if (error) {
        console.error(`Error fetching files: ${error.message}`);
        throw error;
      }

      const hasMainImage = fileList.some((file) => file.name === "mainImage");
      const hasBrandImage = fileList.some((file) => file.name === "brandImage");

      const ximilarReqBody = [];

      if (hasMainImage) {
        ximilarReqBody.push({
          id: listing.id + "mainImage",
          url: `${process.env.SUPABASE_STORAGE_URL}queued-listings/${listing.bucketPath}mainImage`,
        });
      }
      if (hasBrandImage) {
        ximilarReqBody.push({
          id: listing.id + "brandImage",
          url: `${process.env.SUPABASE_STORAGE_URL}queued-listings/${listing.bucketPath}brandImage`,
        });
      }

      const makeXimilarCall = async (listingId) => {
        try {
          const response = await fetch(`${baseUrl}/api/ai/ximilarTagging`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              queuedListingId: listingId,
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
