import { prisma } from "@/db/prismaDB";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { RepricingRuleType } from "@prisma/client";

const validator = (payload, params) => {
  let issueForParam = "";
  const invalidParams = params.some((param) => {
    console.log(param, payload[param]);
    if (
      payload[param] === null ||
      payload[param] === undefined ||
      payload[param] === ""
    ) {
      issueForParam = param;
      return true;
    }
    return false;
  });
  console.log(invalidParams);
  if (invalidParams) {
    return { status: true, issueForParam: issueForParam };
  } else {
    return { status: false };
  }
};
const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const data = req.body;
  const requiredParam = ["name", "categoryId", "listingType"];
  try {
    const payload = {};

    const business = await prisma.business.findUnique({
      where: { email: session.user.email },
    });

    if (business) {
      payload["ownerId"] = business.id;
    }
    payload["name"] = data.name;
    payload["categoryId"] = data.categoryId;
    payload["listingType"] = data.listingType;
    payload["adjustPriceBy"] = parseFloat(data.adjustPriceBy);
    payload["cycle"] = data.cycle;
    payload["roundTo"] = parseFloat(data.roundTo);
    payload["floorPrice"] = parseFloat(data.floorPrice);
    const validatorResponse = validator(payload, requiredParam);
    if (validatorResponse.status) {
      return res.status(400).json({
        error: `${validatorResponse.issueForParam} cannot be empty`,
      });
    } else {
      const records = await prisma.PricingRule.findMany({
        where: {
          categoryId: payload.categoryId,
          ownerId: payload.ownerId,
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
            error: `you can not create a rule with Listing Type ${payload.listingType} as rule already exist with Listing Type ${recordName}. you might update the existing rule`,
          });
        }
      }
      // console.log(records);
      const newListing = await prisma.PricingRule.create({ data: payload });

      res.status(200).json(newListing);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default handler;
