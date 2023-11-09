import { prisma } from "../../../db/prismaDB";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Currently defaults to lifetime data, use "new Date(today.getFullYear(), today.getMonth(), 1);"
  const dateFrom = new Date(req.query.dateFrom || "2000-01-01");
  const dateTo = new Date(req.query.dateTo || new Date());

  try {
    const business = await prisma.business.findUnique({
      where: { email: session.user.email },
      select: {
        listings: {
          where: {
            createdAt: {
              gte: dateFrom,
              lte: dateTo,
            },
          },
          select: {
            status: true,
            isActive: true,
            votes: {
              select: {
                type: true,
              },
            },
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
        },
      },
    });

    if (!business) {
      return res.status(404).json({ message: "Business not found." });
    }

    const listings = business.listings || [];

    const totalListings = listings.length;
    const disposedListings = listings.filter(
      (listing) => listing.status === "DISPOSED"
    ).length;
    const listingsToSell = listings.filter(
      (listing) => listing.status === "SALE" && listing.isActive
    ).length;
    const upVotes = listings.flatMap((listing) =>
      listing.votes.filter((vote) => vote.type === "UP")
    ).length;
    const downVotes = listings.flatMap((listing) =>
      listing.votes.filter((vote) => vote.type === "DOWN")
    ).length;

    const categoryCounts = {};
    listings.forEach((listing) => {
      listing.categories.forEach(({ category }) => {
        categoryCounts[category.name] =
          (categoryCounts[category.name] || 0) + 1;
      });
    });
    const mostCommonCategory = Object.entries(categoryCounts).sort(
      (a, b) => b[1] - a[1]
    )[0];

    const percentageDisposed =
      totalListings !== 0 ? (disposedListings / totalListings) * 100 : 0;
    const percentageToSell =
      totalListings !== 0 ? (listingsToSell / totalListings) * 100 : 0;
    const percentageDownVoted =
      totalListings !== 0 ? (downVotes / totalListings) * 100 : 0;
    const percentageUpVoted =
      totalListings !== 0 ? (upVotes / totalListings) * 100 : 0;

    const stats = {
      totalListings,
      mostCommonCategory: mostCommonCategory ? mostCommonCategory[0] : "None",
      disposedListings,
      listingsToSell,
      percentageDisposed,
      percentageToSell,
      percentageDownVoted,
      percentageUpVoted,
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
