import { prisma } from "@/db/prismaDB";
import { v4 as uuid } from "uuid";
import { AES, enc } from "crypto-ts";

const { Client, Environment } = require("square");

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  try {
    const allIdsToUpdate = [];
    const allSyncedObjects = [];
    const idMappings = {};

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
        environment: Environment.Sandbox,
      });

      const listings = await prisma.listing.findMany({
        where: {
          status: "SALE",
          isSyncedWithSquare: false,
          businessId: business?.id,
        },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
      });

      const items = [];

      for (const listing of listings) {
        const listingId = `#${listing.id}`;
        const mainImage = listing.mainImage
          ? listing.mainImage
          : listing.mainImageUrl;
        const brandImage = listing.brandImage
          ? listing.brandImage
          : listing.brandImageUrl;
        const price = listing.price;
        const categories = listing?.categories
          .map((entry) => entry.category.name)
          .join(" - ");
        const tags = listing?.tags?.join(" - ");

        const item = {
          type: "ITEM",
          id: listingId,
          presentAtAllLocations: true,
          custom_attribute_values: [],
          itemData: {
            name: categories && categories !== "" ? categories : mainImage,
            description: tags,
            variations: [
              {
                type: "ITEM_VARIATION",
                id: `${listingId}-main`,
                presentAtAllLocations: true,
                itemVariationData: {
                  itemId: listingId,
                  name: mainImage,
                  pricingType: "FIXED_PRICING",
                  priceMoney: {
                    amount: price ? price : 0,
                    currency: "USD",
                  },
                },
              },
            ],
          },
        };
        if (brandImage) {
          item.itemData.variations.push({
            type: "ITEM_VARIATION",
            id: `${listingId}-brand`,
            presentAtAllLocations: true,
            itemVariationData: {
              itemId: listingId,
              name: brandImage,
              pricingType: "FIXED_PRICING",
              priceMoney: {
                amount: price ? price : 0,
                currency: "USD",
              },
            },
          });
        }
        items.push(item);
      }
      if (items?.length === 0) {
        res.status(200).json({ message: "No listings to sync." });
        return;
      }

      const response = await client.catalogApi.batchUpsertCatalogObjects({
        idempotencyKey: uuid(),
        batches: [
          {
            objects: items,
          },
        ],
      });

      if (response.statusCode === 200) {
        const idsToUpdate = listings.map((listing) => listing.id);
        allIdsToUpdate.push(...idsToUpdate);
      }
      allSyncedObjects.push(...response?.result?.objects);

      const changes = [];
      const { result } = await client.locationsApi.listLocations();
      const locations = result?.locations || [];
      for (const item of response?.result?.objects) {
        if (item.type === "ITEM") {
          for (const location of locations) {
            changes.push({
              type: "PHYSICAL_COUNT",
              physicalCount: {
                catalogObjectId: item.itemData.variations[0].id,
                state: "IN_STOCK",
                quantity: "1",
                locationId: location.id,
                occurredAt: new Date().toISOString(),
              },
            });
          }
        }
      }

      if (changes.length > 0) {
        await client.inventoryApi.batchChangeInventory({
          idempotencyKey: uuid(),
          changes,
          ignoreUnchangedCounts: true,
        });
      }

      for (const mapping of response?.result?.idMappings) {
        idMappings[mapping?.clientObjectId?.replace("#", "")] =
          mapping.objectId;
      }
    }

    const transactions = [];
    for (const id of allIdsToUpdate) {
      transactions.push(
        prisma.listing.update({
          where: {
            id,
          },
          data: {
            isSyncedWithSquare: true,
            squareId: idMappings[id],
          },
        })
      );
    }
    // await prisma.$transaction(transactions);

    res
      .status(200)
      .json(
        JSON.parse(
          JSON.stringify(allSyncedObjects, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
          )
        )
      );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default handler;
