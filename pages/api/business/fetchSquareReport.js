import { prisma } from "../../../db/prismaDB";
import { AES, enc } from "crypto-ts";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { Client, Environment } from "square";

const padZero = (number) => (number < 10 ? `0${number}` : number.toString());

const calculateDateRangeDuration = (fromDate, toDate) => {
  const diffInTime = new Date(toDate).getTime() - new Date(fromDate).getTime();
  return Math.floor(diffInTime / (1000 * 3600 * 24));
};

const getGroupingBasis = (fromDate, toDate) => {
  const daysDiff = calculateDateRangeDuration(fromDate, toDate);
  if (daysDiff >= 30) {
    return "month";
  } else if (daysDiff >= 7) {
    return "week";
  }
  return "all";
};

const getGroupKey = (date, basis) => {
  const d = new Date(date);
  switch (basis) {
    case "month":
      return `${padZero(d.getMonth() + 1)}/${d
        .getFullYear()
        .toString()
        .slice(-2)}`;
    case "week":
      const firstDayOfWeek = new Date(d.setDate(d.getDate() - d.getDay()));
      return `${padZero(firstDayOfWeek.getMonth() + 1)}/${padZero(
        firstDayOfWeek.getDate()
      )}/${firstDayOfWeek.getFullYear().toString().slice(-2)}`;
    default:
      return "all";
  }
};

const handler = async (req, res) => {
  try {
    const session = await getServerSession(req, res, authOptions);
    const { fromDate, toDate, category } = req.query;

    if (!session)
      return res.status(500).json({ message: "Unauthenticated request." });

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

    let locationId;
    try {
      const locationResponse = await client.locationsApi.retrieveLocation(
        "main"
      );
      locationId = locationResponse.result.location.id;
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Unable to retrieve location id" });
    }

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
    const groupingBasis = getGroupingBasis(fromDate, toDate);
    let groupedLineItems = {},
      statsByGroup = {};

    orders.forEach((order) => {
      order.line_items.forEach((item) => {
        // slice "-main" off the end of the id
        const itemId = item.catalog_object_id.slice(0, -5);
        const soldPrice = item.total_money;
        const groupKey = getGroupKey(order.closedAt, groupingBasis);

        if (!groupedLineItems[groupKey]) {
          groupedLineItems[groupKey] = [];
          statsByGroup[groupKey] = {
            revenue: 0,
            totalItemsSold: 0,
            totalListingPrice: 0,
            totalDaysListed: 0,
            donations: 0,
            accepted: 0,
          };
        }

        groupedLineItems[groupKey].push({
          id: itemId,
          category: item.name,
          soldPrice,
          soldDate: new Date(order.closedAt).toISOString(),
        });
        statsByGroup[groupKey].revenue += soldPrice;
        statsByGroup[groupKey].totalItemsSold += 1;
      });
    });

    const uniqueItemIds = Array.from(
      new Set(
        Object.values(groupedLineItems)
          .flat()
          .map((item) => item.id)
      )
    );

    let whereConditionForListings = { id: { in: uniqueItemIds } };
    if (category && category !== "All") {
      whereConditionForListings = {
        ...whereConditionForListings,
        categories: {
          some: {
            category: {
              name: category,
            },
          },
        },
      };
    }

    const listingsById = await prisma.listing.findMany({
      where: { id: { in: uniqueItemIds } },
      select: {
        id: true,
        createdAt: true,
        price: true,
        categories: {
          select: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const listingsByIdMap = new Map(
      listingsById.map((listing) => [listing.id, listing])
    );

    for (const groupKey in groupedLineItems) {
      groupedLineItems[groupKey].forEach((item) => {
        const listing = listingsByIdMap.get(item.id);
        if (listing) {
          const listingDaysListed = Math.floor(
            (new Date(item.soldDate) - new Date(listing.createdAt)) /
              (1000 * 60 * 60 * 24)
          );

          const firstCategoryName =
            listing.categories && listing.categories.length > 0
              ? listing.categories[0].category.name
              : null;

          item.listingData = {
            createdAt: listing.createdAt,
            price: listing.price,
            category: firstCategoryName,
          };
          statsByGroup[groupKey].totalListingPrice += listing.price || 0;
          statsByGroup[groupKey].totalDaysListed += listingDaysListed;
        }
      });
    }

    const listingsInDateRange = await prisma.listing.findMany({
      where: {
        businessId: business.id,
        createdAt: {
          gte: new Date(fromDate),
          lte: new Date(toDate),
        },
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    listingsInDateRange.forEach((listing) => {
      const groupKey = getGroupKey(listing.createdAt, groupingBasis);

      if (!statsByGroup[groupKey]) {
        statsByGroup[groupKey] = {
          revenue: 0,
          totalItemsSold: 0,
          totalListingPrice: 0,
          totalDaysListed: 0,
          donations: 0,
          accepted: 0,
        };
      }

      statsByGroup[groupKey].donations += 1;
      if (["SOLD", "SALE"].includes(listing.status)) {
        statsByGroup[groupKey].accepted += 1;
      }
    });

    for (const groupKey in statsByGroup) {
      const group = statsByGroup[groupKey];
      const itemCount = group.totalItemsSold > 0 ? group.totalItemsSold : 1;

      group.averageSalePrice = group.revenue / itemCount;
      group.averageListingPrice = group.totalListingPrice / itemCount;
      group.averageDaysListed = group.totalDaysListed / itemCount;
    }

    res.status(200).json({ statsByGroup });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
