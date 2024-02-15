import { prisma } from "../../../db/prismaDB";
import { v4 as uuid } from "uuid";
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
    const allIdsToUpdate = [];

    const businesses = await prisma.business.findMany({
      where: { NOT: [{ squareAccessToken: null }] },
    });

    for (const business of businesses) {
      const squareAccessToken = AES.decrypt(
        business?.squareAccessToken,
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
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
      });
      const catalogObjectIds = listingsToFetchInventory.map(
        (listing) => listing.squareId
      );

      const { result } = await client.locationsApi.listLocations();
      const locations = result?.locations || [];
      const locationIds = locations.map((loc) => loc.id);

      const response = await client.inventoryApi.batchRetrieveInventoryCounts({
        catalogObjectIds,
        locationIds,
      });

      const soldListingsSquareIds = [];

      for (const count of response?.result?.counts) {
        if (count?.quantity === "0") {
          soldListingsSquareIds.push(count.catalogObjectId);
        }
      }

      if (soldListingsSquareIds?.length === 0) {
        res.status(200).json({ message: "No listings to sync." });
        return;
      }

      await prisma.listing.updateMany({
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
    }

    res.status(200).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default verifySignature(handler);
