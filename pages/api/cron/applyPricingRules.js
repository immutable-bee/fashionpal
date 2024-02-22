import { prisma } from "../../../db/prismaDB";
import { verifySignature } from "@upstash/qstash/dist/nextjs";

export const config = {
  api: {
    bodyParser: false,
  },
};
function calculateDiscount(listing, pricingRule) {
  const createdDate = new Date(listing.createdAt);
  const currentDate = new Date();
  const timeDifference = currentDate - createdDate;
  let cycleInMilliseconds;
  if (pricingRule.cycle === "weekly") {
    cycleInMilliseconds = 7 * 24 * 60 * 60 * 1000;
  } else if (pricingRule.cycle === "bi-weekly") {
    cycleInMilliseconds = 2 * 7 * 24 * 60 * 60 * 1000;
  } else if (pricingRule.cycle === "monthly") {
    cycleInMilliseconds = 30 * 24 * 60 * 60 * 1000;
  } else {
    return null;
  }

  const cycleDifference = Math.floor(timeDifference / cycleInMilliseconds);
  let discountPercentage = (cycleDifference + 1) * pricingRule.adjustPriceBy;

  const calculation =
    listing.price - (discountPercentage / 100) * listing.price;
  let discountPrice =
    calculation > pricingRule.floorPrice ? calculation : pricingRule.floorPrice;
  discountPrice = Number.isInteger(discountPrice)
    ? discountPrice - pricingRule.roundTo
    : discountPrice;
  return {
    discountPrice,
    discountPercentage,
  };
}

const calculateMemberPrice = (listing, pricingRule) => {};

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
    const pricingRules = await prisma.pricingRule.findMany({});
    const pricingRuleMap = new Map();
    pricingRules.forEach((rule) => {
      const key = `${rule.categoryId}-${rule.ownerId}`;
      pricingRuleMap.set(key, rule);
    });
    const updatedListings = [];
    listings.map(async (listing) => {
      if (listing.categories.length > 0) {
        const key = `${listing.categories[0].categoryId}-${listing.businessId}`;
        const applicablePricingRule = pricingRuleMap.get(key);
        if (applicablePricingRule) {
          let updatedListing;
          if (applicablePricingRule.ruleType === "STANDARD") {
            const discountInfo = calculateDiscount(
              listing,
              applicablePricingRule
            );

            if (discountInfo) {
              updatedListing = await prisma.listing.update({
                where: { id: listing.id },
                data: {
                  discountPrice: discountInfo.discountPrice,
                  discountPercentage: discountInfo.discountPercentage,
                },
              });
            }
          }
          if (applicablePricingRule.ruleType === "SAlE") {
            const memberPriceInfo = calculateMemberPrice(
              listing,
              applicablePricingRule
            );

            if (memberPriceInfo) {
              updatedListing = await prisma.listing.update({
                where: { id: listing.id },
                data: {
                  memberPrice: memberPriceInfo.memberPrice,
                },
              });
            }
          }

          updatedListings.push(updatedListing);
        }

        return listing;
      }
    });

    res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default verifySignature(handler);
