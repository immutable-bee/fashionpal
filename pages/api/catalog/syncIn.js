import { prisma } from "@/db/prismaDB";
import { v4 as uuid } from "uuid";
import { AES, enc } from "crypto-ts";
import { Readable } from "stream";

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
      try {
        const squareAccessToken = AES.decrypt(
          business?.squareAccessToken,
          process.env.NEXTAUTH_SECRET
        ).toString(enc.Utf8);

        const client = new Client({
          accessToken: squareAccessToken,
          environment: Environment.Production,
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
        const allCategories = [];
        for (const listing of listings) {
          const listingId = `#${listing.id}`;
          const mainImage = listing.mainImage
            ? listing.mainImage
            : listing.mainImageUrl;
          const brandImage = listing.brandImage
            ? listing.brandImage
            : listing.brandImageUrl;
          const price = parseInt(
            (parseFloat(listing.price.toString()) * 100).toString()
          );
          let categories = listing?.categories.map(
            (entry) => entry.category.name
          );
          categories = categories.map((c) => (c === "" ? "General" : c));
          if (categories.length === 0) {
            categories.push("General");
          }

          allCategories.push(...categories);
          const tags = listing?.tags?.join(" - ");
          const description = [mainImage];
          if (tags.length > 0) {
            description.push(tags);
          }
          const item = {
            type: "ITEM",
            id: listingId,
            presentAtAllLocations: true,
            custom_attribute_values: [],
            itemData: {
              name: categories.join(" - "),
              description: description.join(" - "),
              variations: [
                {
                  type: "ITEM_VARIATION",
                  id: `${listingId}-subscriber`,
                  presentAtAllLocations: true,
                  itemVariationData: {
                    itemId: listingId,
                    sku: listing.Barcode
                      ? `${listing.Barcode}-subscriber`
                      : `${listingId}-subscriber`,
                    name: "SUBSCRIBER",
                    pricingType: "FIXED_PRICING",
                    priceMoney: {
                      amount: price ? price : 0,
                      currency: "USD",
                    },
                  },
                },
                {
                  type: "ITEM_VARIATION",
                  id: `${listingId}-non-subscriber`,
                  presentAtAllLocations: true,
                  itemVariationData: {
                    itemId: listingId,
                    sku: listing.Barcode
                      ? `${listing.Barcode}-non-subscriber`
                      : `${listingId}-non-subscriber`,
                    name: "NON-SUBSCRIBER",
                    pricingType: "FIXED_PRICING",
                    priceMoney: {
                      amount: price ? price : 0,
                      currency: "USD",
                    },
                  },
                },
              ],
              productType: "REGULAR",
              categories: categories,
            },
          };

          items.push(item);
        }

        const uniqueCategories = [...new Set(allCategories)];
        if (uniqueCategories.length > 0) {
          const categoriesResponse = await client.catalogApi.listCatalog(
            undefined,
            "category"
          );
          const existentCategories = {};

          for (const entry of categoriesResponse?.result?.objects) {
            existentCategories[entry.categoryData.name] = entry.id;
          }
          const categoriesToAdd = [];
          for (const category of uniqueCategories) {
            if (!existentCategories[category]) {
              categoriesToAdd.push({
                type: "CATEGORY",
                id: `#${category}`,
                presentAtAllLocations: true,
                categoryData: {
                  name: category,
                },
              });
            }
          }
          if (categoriesToAdd.length > 0) {
            const addCategoriesResponse =
              await client.catalogApi.batchUpsertCatalogObjects({
                idempotencyKey: uuid(),
                batches: [
                  {
                    objects: categoriesToAdd,
                  },
                ],
              });

            if (addCategoriesResponse.statusCode === 200) {
              for (const entry of addCategoriesResponse?.result?.objects) {
                existentCategories[entry.categoryData.name] = entry.id;
              }
            }
          }

          for (const item of items) {
            if (item.itemData.categories.length > 0) {
              item.itemData.category_id =
                existentCategories[item.itemData.categories[0]];
            }

            item.itemData.categories = item.itemData.categories.map(
              (c, index) => ({
                id: existentCategories[c],
                ordinal: index + 1,
              })
            );
          }
        }

        if (items?.length === 0) {
          continue;
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
              for (const variation of item.itemData.variations) {
                changes.push({
                  type: "PHYSICAL_COUNT",
                  physicalCount: {
                    catalogObjectId: variation.id,
                    state: "IN_STOCK",
                    quantity: "1",
                    locationId: location.id,
                    occurredAt: new Date().toISOString(),
                  },
                });
              }
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
      } catch (e) {
        console.log(e.message);
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
            squareId: idMappings[`${id}-main`],
          },
        })
      );
    }
    await prisma.$transaction(transactions);
    const message =
      allIdsToUpdate.length > 0
        ? JSON.parse(
            JSON.stringify(allSyncedObjects, (key, value) =>
              typeof value === "bigint" ? value.toString() : value
            )
          )
        : { message: "No listings to sync." };

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
