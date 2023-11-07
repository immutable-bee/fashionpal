import { prisma } from "../../../../db/prismaDB";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const listingId = req.query.id;

  const business = await prisma.business.findUnique({
    where: { email: session.user.email },
  });

  if (!business) {
    return res
      .status(404)
      .json({ message: "No business record found for the provided email" });
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing) {
    return res
      .status(404)
      .json({ message: "No listing record found for the provided id" });
  }

  if (listing.businessId !== business.id) {
    return res.status(500).json({
      message:
        "Unauthorized: Listing is not associated with the provided business",
    });
  }

  const updatedListing = await prisma.listing.update({
    where: { id: listingId },
    data: {
      isDisposed: true,
    },
  });

  res.status(200).json({ message: "Listing Disposed: ", updatedListing });
};

export default handler;
