import { prisma } from "../../../db/prismaDB";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const dateTo = req.query.dateTo ? new Date(req.query.dateTo) : new Date();
  const defaultDateFrom = new Date(2000, 0, 1);
  const dateFrom = req.query.dateFrom
    ? new Date(req.query.dateFrom)
    : defaultDateFrom;

  try {
    const consumer = await prisma.consumer.findUnique({
      where: { email: session.user.email },
      select: {
        votes: {
          where: {
            date: {
              gte: dateFrom,
              lte: dateTo,
            },
          },
          select: {
            type: true,
            date: true,
            listing: {
              select: {
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
        },
      },
    });

    if (!consumer) {
      return res.status(404).json({ message: "Consumer not found" });
    }

    const categoryCounts = {};
    let upvotes = 0;
    let downvotes = 0;

    consumer.votes.forEach((vote) => {
      if (vote.type === "UP") {
        upvotes++;
        vote.listing.categories.forEach((c) => {
          categoryCounts[c.category.name] =
            (categoryCounts[c.category.name] || 0) + 1;
        });
      } else {
        downvotes++;
      }
    });

    const mostCommonUpvoteCategory = Object.entries(categoryCounts).sort(
      (a, b) => b[1] - a[1]
    )[0][0];
    const totalVotes = upvotes + downvotes;

    const stats = {
      votesInDateRange: consumer.votes.length,
      mostCommonUpvoteCategory: mostCommonUpvoteCategory,
      upvotedListings: upvotes,
      downvotedListings: downvotes,
      percentUpvotedListings: (upvotes / totalVotes) * 100,
      percentDownvotedListings: (downvotes / totalVotes) * 100,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
