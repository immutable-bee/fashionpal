import { prisma } from "@/db/prismaDB";
import { v4 as uuid } from "uuid";

const { Client, Environment, ApiError } = require("square");

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  const { baseUrl, batchSize } = req.query;

  try {
    const listings = await prisma.listing.findMany({
      where: { status: "SALE", isSyncedWithSquare: false },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
    // console.log(JSON.stringify(listings));

    const items = [];

    for (const listing of listings) {
      console.log(JSON.stringify(listing));

      const listingId = `#${listing.id}`;
      const mainImage = listing.mainImage;
      const brandImage = listing.mainImage;
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
              id: `#${listingId}-main`,
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
          id: `#${listingId}-brand`,
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
      await prisma.listing.updateMany({
        where: {
          id: {
            in: idsToUpdate,
          },
        },
        data: {
          isSyncedWithSquare: true,
        },
      });
    }

    res
      .status(200)
      .json(
        JSON.parse(
          JSON.stringify(response?.result?.objects, (key, value) =>
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
