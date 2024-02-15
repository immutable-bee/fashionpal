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

      const catalogObjectIds = listingsToFetchInventory.map(
        (listing) => listing.squareId
      );

      const { result } = await client.locationsApi.listLocations();
      const locationIds = result?.locations?.map((loc) => loc.id) || [];

      const response = await client.inventoryApi.batchRetrieveInventoryCounts({
        catalogObjectIds,
        locationIds,
      });

      const soldListingsSquareIds =
        response?.result?.counts
          ?.filter((count) => count?.quantity === "0")
          .map((count) => count.catalogObjectId) || [];

      if (soldListingsSquareIds.length > 0) {
        const updateResult = await prisma.listing.updateMany({
          where: {
            squareId: {
              in: soldListingsSquareIds,
            },
          },
          data: {
            isActive: false,
            status: "SOLD",
          },
        });

        allIdsToUpdate.push(...soldListingsSquareIds);
      } else {
        allBusinessesProcessed = false;
      }
    }

    if (allIdsToUpdate.length === 0) {
      return res
        .status(allBusinessesProcessed ? 200 : 204)
        .json({ message: "No listings were updated." });
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
