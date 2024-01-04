import { prisma } from "../../../db/prismaDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const consumer = await prisma.consumer.findUnique({
      where: { email: session.user.email },
    });

    if (!consumer) {
      return res.status(500).json({ message: "Consumer record not found." });
    }

    const { listingId, isLiked, isUnLiked } = req.body;

    if (!listingId) {
      return res.status(400).json({ message: "ID is missing." });
    }

    let voteType;
    if (isLiked === true) {
      voteType = "UP";
    } else if (isUnLiked === true) {
      voteType = "DOWN";
    }

    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: consumer.id,
        listingId: listingId,
      },
    });

    if (voteType) {
      if (existingVote) {
        const updateVote = await prisma.vote.update({
          where: {
            id: existingVote.id,
          },
          data: {
            type: voteType,
          },
        });
      } else {
        const createVote = await prisma.vote.create({
          data: {
            type: voteType,
            user: {
              connect: { id: consumer.id },
            },
            listing: {
              connect: {
                id: listingId,
              },
            },
          },
        });
      }
    } else {
      if (existingVote) {
        const deleteVote = await prisma.vote.delete({
          where: { id: existingVote.id },
        });
      } else {
        return res
          .status(200)
          .json({ message: "No vote to update or delete." });
      }
    }

    res.status(200).json("Vote successfully updated.");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default handler;
