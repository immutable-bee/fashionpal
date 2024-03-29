import { prisma } from "../../../../db/prismaDB";
import { AES, enc } from "crypto-ts";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { Client, Environment } from "square";

const handler = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    const { fromDate, toDate } = req.body;

    if (!session) {
      return res.status(500).json({ message: "Unauthenticated request." });
    }

    const business = await prisma.business.findUnique({
      where: { email: session.user.email },
    });
    if (!business || !business.squareAccessToken)
      return res.status(404).json({ message: "Business not found." });

    const squareAccessToken = AES.decrypt(
      business.squareAccessToken,
      process.env.NEXTAUTH_SECRET
    ).toString(enc.Utf8);
    const client = new Client({
      accessToken: squareAccessToken,
      environment: Environment.Sandbox,
    });

    const listingsInDateRange = await prisma.listing.findMany({
      where: {
        businessId: business.id,
        createdAt: {
          gte: new Date(fromDate),
          lte: new Date(toDate),
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    const orderResponse = await client.ordersApi.searchOrders({
      locationIds: [locationId],
      query: {
        filter: {
          stateFilter: { states: ["COMPLETED"] },
          dateTimeFilter: { closedAt: { startAt: fromDate, endAt: toDate } },
        },
        sort: { sortField: "CLOSED_AT", sortOrder: "DESC" },
      },
    });

    const orders = orderResponse.result.orders;
    let statsByCategory = {};

    listingsInDateRange.forEach((listing) => {
      let categoryName;
      let highestProbabilityCategory = null;
      let highestProbability = -1;

      for (const cat of listing.categories) {
        if (cat.category.probability === null) {
          categoryName = cat.category.taxonomicPath;
          break;
        } else if (cat.category.probability > highestProbability) {
          highestProbability = cat.category.probability;
          highestProbabilityCategory = cat.category;
        }
      }
      if (categoryName === null && highestProbabilityCategory !== null) {
        categoryName = highestProbabilityCategory.taxonomicPath;
      }

      let soldDate = new Date(); // Default to current date if not sold
      let soldPrice = 0;
      const soldOrder = orders.find((order) =>
        order.lineItems.some((item) =>
          item.catalogObjectId.startsWith(listing.id)
        )
      );
      if (soldOrder) {
        soldDate = new Date(soldOrder.closedAt);
        const soldItem = soldOrder.lineItems.find((item) =>
          item.catalogObjectId.startsWith(listing.id)
        );
        if (soldItem) {
          soldPrice = soldItem.totalMoney.amount;
        }
      }

      const daysListed = Math.floor(
        (soldDate - new Date(listing.createdAt)) / (1000 * 3600 * 24)
      );

      if (categoryName) {
        if (!statsByCategory[categoryName]) {
          statsByCategory[categoryName] = {
            revenue: 0,
            totalItemsSold: 0,
            totalListingPrice: 0,
            totalDaysListed: 0,
            accepted: 0,
            donations: 0,
          };
          statsByCategory[categoryName].totalListingPrice += listing.price || 0;
          statsByCategory[categoryName].totalDaysListed += daysListed;
          statsByCategory[categoryName].donations += 1;
          statsByCategory[categoryName].revenue += soldPrice;
          if (["SOLD", "SALE"].includes(listing.status)) {
            statsByCategory[categoryName].accepted += 1;
          }
          if (soldOrder) {
            statsByCategory[categoryName].totalItemsSold += 1;
          }
        }
      }
    });

    orders.forEach((order) => {
      order.lineItems.forEach((item) => {
        const itemId = item.catalogObjectId.replace(
          /-(subscriber|non-subscriber)$/,
          ""
        );
        const soldPrice = item.totalMoney;

        const listing = listingsInDateRange.find(
          (listing) => listing.id === itemId
        );
        let categoryName;
        let highestProbabilityCategory = null;
        let highestProbability = -1;

        for (const cat of listing.categories) {
          if (cat.category.probability === null) {
            categoryName = cat.category.taxonomicPath;
            break;
          } else if (cat.category.probability > highestProbability) {
            highestProbability = cat.category.probability;
            highestProbabilityCategory = cat.category;
          }
        }
        if (categoryName === null && highestProbabilityCategory !== null) {
          categoryName = highestProbabilityCategory.taxonomicPath;
        }

        if (categoryName) {
          statsByCategory[categoryName].revenue += soldPrice;
          statsByCategory[categoryName].totalItemsSold += 1;
        }
      });
    });

    Object.keys(statsByCategory).forEach((category) => {
      const categoryStats = statsByCategory[category];
      categoryStats.averageListingPrice =
        categoryStats.totalListingPrice / categoryStats.donations;
      categoryStats.averageSalePrice =
        categoryStats.revenue / categoryStats.totalItemsSold;
      categoryStats.rejected = categoryStats.donations - categoryStats.accepted;
      if (categoryStats.donations > 0) {
        categoryStats.averageDaysListed =
          categoryStats.totalDaysListed / categoryStats.donations;
      } else {
        categoryStats.averageDaysListed = 0;
      }
    });

    res.status(200).json({ statsByCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
