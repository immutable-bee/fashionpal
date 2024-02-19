import { prisma } from "../../../db/prismaDB";
import { AES, enc } from "crypto-js";
import { verifySignature } from "@upstash/qstash/dist/nextjs";

const { Client, Environment } = require("square");

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  try {
    let allIdsToUpdate = [];
    let allBusinessesProcessed = true;

    const businesses = await prisma.business.findMany({
      where: { NOT: [{ squareAccessToken: null }] },
    });

    if (businesses.length === 0) {
      return res
        .status(200)
        .json({ message: "No businesses with Square access tokens found." });
    }

    for (const business of businesses) {
      const squareAccessToken = AES.decrypt(
        business.squareAccessToken,
        process.env.NEXTAUTH_SECRET
      ).toString(enc.Utf8);
      const client = new Client({
        accessToken: squareAccessToken,
        environment: Environment.Production,
      });

      const listingsToFetchInventory = await prisma.listing.findMany({
        where: {
          status: "SALE",
          isActive: true,
          isSyncedWithSquare: true,
          NOT: [{ squareId: null }],
        },
      });

      if (listingsToFetchInventory.length === 0) {
        continue;
      }

      const catalogObjectIds = listingsToFetchInventory.flatMap((listing) => [
        `${listing.id}-subscriber`,
        `${listing.id}-non-subscriber`,
      ]);

      const { result } = await client.locationsApi.listLocations();
      const locationIds = result?.locations?.map((loc) => loc.id) || [];

      const response = await client.inventoryApi.batchRetrieveInventoryCounts({
        catalogObjectIds,
        locationIds,
      });
      console.log(response.result);

      if (
        response &&
        response.result &&
        Array.isArray(response.result.counts)
      ) {
        const inventoryAdjustments = [];
        response.result.counts.forEach((count) => {
          if (count.quantity === "0") {
            const otherVariationId = count.catalogObjectId.endsWith(
              "-subscriber"
            )
              ? count.catalogObjectId.replace("-subscriber", "-non-subscriber")
              : count.catalogObjectId.replace("-non-subscriber", "-subscriber");

            locationIds.forEach((locationId) => {
              inventoryAdjustments.push({
                type: "ADJUSTMENT",
                adjustment: {
                  catalogObjectId: otherVariationId,
                  fromState: "IN_STOCK",
                  toState: "WASTE",
                  locationId: locationId,
                  quantity: "1",
                },
              });
            });

            const listingId = count.catalogObjectId.split("-")[0];
            allIdsToUpdate.push(listingId);
          }
        });

        if (inventoryAdjustments.length > 0) {
          await client.inventoryApi.batchChangeInventory({
            idempotencyKey: uuid(),
            changes: inventoryAdjustments,
            ignoreUnchangedCounts: true,
          });
        }

        await Promise.all(
          allIdsToUpdate.map((listingId) =>
            prisma.listing.update({
              where: { id: listingId },
              data: { isActive: false, status: "SOLD" },
            })
          )
        );
      } else {
        res
          .status(204)
          .json("Unexpected response structure or no counts returned:");
      }

      if (allIdsToUpdate.length === 0) {
        return res.status(204).json({ message: "No listings were updated." });
      }
    }

    res
      .status(200)
      .json({ message: `Updated listings: ${allIdsToUpdate.join(", ")}` });
  } catch (error) {
    console.error("Failed to process the request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default verifySignature(handler);
