import { prisma } from "../../../db/prismaDB";
import { verifySignature } from "@upstash/qstash/dist/nextjs";

export const config = {
  api: {
    bodyParser: false,
  },
};
function calculateDiscount(listing, pricingRule) {
  console.table(pricingRule);
  // Logic to calculate the difference in weeks
  const createdDate = new Date(listing.createdAt);
  console.log(createdDate);
  const currentDate = new Date();
  console.log(currentDate);
  const timeDifference = currentDate - createdDate;
  let cycleInMilliseconds;
  if (pricingRule.cycle === "weekly") {
    console.log("Weekly");
    cycleInMilliseconds = 7 * 24 * 60 * 60 * 1000;
  } else if (pricingRule.cycle === "bi-weekly") {
    console.log("bi-weekly");
    cycleInMilliseconds = 2 * 7 * 24 * 60 * 60 * 1000;
  } else if (pricingRule.cycle === "monthly") {
    console.log("monthly");
    cycleInMilliseconds = 30 * 24 * 60 * 60 * 1000;
  } else {
    return null;
  }

  const cycleDifference = Math.floor(timeDifference / cycleInMilliseconds);
  console.log(pricingRule.cycle, cycleDifference);
  let discountPercentage = (cycleDifference + 1) * pricingRule.adjustPriceBy;

  console.log(listing.price, pricingRule.adjustPriceBy);
  const calculation =
    listing.price - (discountPercentage / 100) * listing.price;
  console.log(pricingRule.floorPrice);
  let discountPrice =
    calculation > pricingRule.floorPrice ? calculation : pricingRule.floorPrice;
  discountPrice = Number.isInteger(discountPrice)
    ? discountPrice - pricingRule.roundTo
    : discountPrice;
  console.log("calculation", calculation);
  console.log("discountPrice", discountPrice);
  return {
    discountPrice,
    discountPercentage,
  };
  // }
}

const handler = async (req, res) => {
  try {
    const listings = await prisma.listing.findMany({
      where: { isActive: true },
      include: {
        categories: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const pricingRules = await prisma.PricingRule.findMany({});
    const updatedListings = [];
    const discountedListings = listings.map(async (listing) => {
      const applicablePricingRule = pricingRules.find(
        (rule) =>
          !!(
            listing.categories.length > 0 &&
            listing.categories[0].categoryId === rule.categoryId &&
            rule.ownerId === listing.businessId
          )
      );
      console.log(applicablePricingRule);
      if (applicablePricingRule) {
        const discountInfo = calculateDiscount(listing, applicablePricingRule);
        console.log(discountInfo);

        if (discountInfo) {
          // Update the database with the calculated discounts
          const updatedListing = await prisma.listing.update({
            where: { id: listing.id },
            data: {
              discountPrice: discountInfo.discountPrice,
              discountPercentage: discountInfo.discountPercentage,
            },
          });

          updatedListings.push(updatedListing);
        }
      }

      return listing;
    });

    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default verifySignature(handler);
