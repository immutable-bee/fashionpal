import { prisma } from "../../../../db/prismaDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const business = await prisma.business.findUnique({
    where: { email: session.user.email },
  });

  const queue = await prisma.listingQueue.findUnique({
    where: { ownerId: business.id },
    include: {
      listings: {
        include: {
          relatedProducts: true,
        },
      },
    },
  });

  if (!queue) {
    // Handle the case where the queue is not found
    return res.status(200).json({ listings: [] });
  }

  if (!queue.listings) {
    // Handle the case where listings is not found or is null
    return res.status(200).json({ listings: [] });
  }

  queue.listings = queue.listings.map((listing) => {
    listing.mainImage = `${process.env.SUPABASE_STORAGE_URL}queued-listings/${listing.bucketPath}/mainImage`;
    return listing;
  });

  res.status(200).json(queue);
};

export default handler;
