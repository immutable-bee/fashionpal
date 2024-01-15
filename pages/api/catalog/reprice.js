import { prisma } from "@/db/prismaDB";
import { v4 as uuid } from "uuid";
import { AES, enc } from "crypto-ts";

const { Client, Environment } = require("square");

const handler = async (req, res) => {
  try {
    const { email, price, type, listingId } = req.body;
    const newPrice = parseInt((parseFloat(price) * 100).toString());
    const business = await prisma.business.findUnique({
      where: { email },
    });

    if (!business || !business?.squareAccessToken) {
      return res.status(404).json({ message: "Business not found." });
    }

    const squareAccessToken = AES.decrypt(
      business?.squareAccessToken,
      process.env.NEXTAUTH_SECRET
    ).toString(enc.Utf8);

    const client = new Client({
      accessToken: squareAccessToken,
      environment: Environment.Production,
    });

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    let item = null;
    let version = null;
    if (listing?.squareId) {
      const response = await client.catalogApi.retrieveCatalogObject(
        listing.squareId,
        undefined,
        undefined
      );
      if (response.statusCode === 200) {
        item = response?.result?.object;
      }
    }

    if (!item) {
      res.status(404).json({ message: "Square item not found" });
      return;
    }

    const itemId = item.id;
    let itemVariation;

    for (const variation of item.itemData.variations) {
      if (variation.itemVariationData.name === type.toUpperCase()) {
        itemVariation = variation;
      }
    }

    let message = "Nothing was repriced.";

    if (itemId && itemVariation) {
      itemVariation.itemVariationData.name = "SUBSCRIBER";
      itemVariation.itemVariationData.priceMoney = {
        amount: newPrice,
        currency: "USD",
      };
      const response = await client.catalogApi.upsertCatalogObject({
        idempotencyKey: uuid(),
        object: itemVariation,
      });
      message = response?.result?.catalogObject;
    }

    res
      .status(200)
      .json(
        JSON.parse(
          JSON.stringify(message, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
          )
        )
      );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
