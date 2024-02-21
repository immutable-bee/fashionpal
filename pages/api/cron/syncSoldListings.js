import { prisma } from "../../../db/prismaDB";
import { verifySignature } from "@upstash/qstash/dist/nextjs";
import { AES, enc } from "crypto-js";
import { Client, Environment } from "square";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  try {
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

      const location = await client.locationsApi.listLocations();

      const locationId = location.result.locations[0].id;

      const endAt = new Date();
      const startAt = new Date();
      startAt.setDate(endAt.getDate() - 7);

      const response = await client.ordersApi.searchOrders({
        locationIds: [locationId],
        query: {
          filter: {
            stateFilter: {
              states: ["COMPLETED"],
            },
            dateTimeFilter: {
              createdAt: {
                startAt: startAt.toISOString(),
                endAt: endAt.toISOString(),
              },
            },
          },
        },
      });

      const orders = response.result.orders;

      const skus = orders.map((order) => {
        console.log(order.lineItems[0].note);
        return order.lineItems[0].note;
      });

      const updateListings = await prisma.listing.updateMany({
        where: {
          businessId: business.id,
          Barcode: {
            in: skus,
          },
        },
        data: { status: "SOLD" },
      });
    }

    return res.status(200).json({ message: "Orders synced to listings" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default verifySignature(handler);
