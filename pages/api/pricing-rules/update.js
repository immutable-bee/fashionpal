import { prisma } from "@/db/prismaDB";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { RepricingRuleType } from "@prisma/client";
import PayloadValidator from "../../../components/utility/payloadValidator";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { id } = req.body;
  // Ensure that id is defined
  if (!id) {
    return res.status(400).json({ message: "ID is missing." });
  }
  const business = await prisma.business.findUnique({
    where: { email: session.user.email },
  });
  const payload = { ...req.body };
  if (business) {
    payload["ownerId"] = business.id;
  }
  payload.adjustPriceBy = parseFloat(payload.adjustPriceBy);
  payload.roundTo = parseFloat(payload.roundTo);
  payload.floorPrice = parseFloat(payload.floorPrice);
  if (payload.ruleType === "SALE") {
    if (payload.isRecurring) {
      payload.saleStartDate = null;
      payload.saleEndDate = null;
      payload.daysOfWeek = data.daysOfWeek;
    } else {
      if (payload.saleStartDate) {
        return res.status(400).json({
          error: `Start Date cannot be empty`,
        });
      }
      payload.daysOfWeek = [];
    }
  }
  const requiredParam = ["name", "categoryId", "listingType", "ruleType"];

  try {
    const validatorResponse = PayloadValidator(payload, requiredParam);
    if (validatorResponse.status) {
      return res.status(400).json({
        error: `${validatorResponse.issueForParam} cannot be empty`,
      });
    } else {
      const records = await prisma.PricingRule.findMany({
        where: {
          categoryId: payload.categoryId,
          ownerId: payload.ownerId,
          id: {
            not: {
              equals: payload.id,
            },
          },
        },
      });

      if (records.length > 0) {
        let recordName = "";
        const hasIssue = records.some((record) => {
          const excludePremiumCondition =
            record.type === RepricingRuleType.EXCLUDE_PREMIUM &&
            (payload.listingType === RepricingRuleType.EXCLUDE_PREMIUM ||
              payload.listingType === RepricingRuleType.ALL);
          const premiumOnlyCondition =
            record.type === RepricingRuleType.PREMIUM_ONLY &&
            (payload.listingType === RepricingRuleType.PREMIUM_ONLY ||
              payload.listingType === RepricingRuleType.ALL);
          if (
            record.listingType === RepricingRuleType.ALL ||
            excludePremiumCondition ||
            premiumOnlyCondition
          ) {
            recordName = record.listingType;
            return true;
          }
          return false;
        });
        if (hasIssue) {
          return res.status(400).json({
            error: `you can not update a rule with Listing Type ${payload.listingType} as rule already exist with Listing Type ${recordName}. you might update the existing rule`,
          });
        }
      }
      const updatedPriceRule = await prisma.PricingRule.update({
        where: {
          id: id,
        },
        data: payload,
      });

      res.status(200).json(updatedPriceRule);
    }
  } catch (error) {
    console.error("Error updating Price Rule:", error);
    res.status(500).json({ message: error.message });
  }
}
