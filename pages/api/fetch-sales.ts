import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const type = req.query.type;
  const customStartDate: any = req.query.start_date;
  const customEndDate: any = req.query.end_date;
  const searchName = req.query.name;

  const currentDate = new Date().toISOString();

  try {
    let sales;
    const currentDate = new Date().toISOString();

    const formatDate = (date: string) => {
      return new Date(date).toISOString();
    };

    let baseQuery: any = {};

    // If name is provided, add a name filter
    if (searchName) {
      baseQuery.name = {
        contains: searchName,
        mode: "insensitive", // Case insensitive search
      };
    }

    if (type === "current") {
      baseQuery.start_date = { lte: currentDate };
      baseQuery.end_date = { gte: currentDate };
    } else if (type === "upcoming") {
      baseQuery.start_date = { gt: currentDate };
    }

    if (customStartDate) {
      const startDateQuery = { gte: formatDate(customStartDate) };
      baseQuery.start_date = baseQuery.start_date
        ? { ...baseQuery.start_date, ...startDateQuery }
        : startDateQuery;
    }

    if (customEndDate) {
      const endDateQuery = { lte: formatDate(customEndDate) };
      baseQuery.end_date = baseQuery.end_date
        ? { ...baseQuery.end_date, ...endDateQuery }
        : endDateQuery;
    }

    if (
      (!type && (!customStartDate || !customEndDate)) ||
      (type && type !== "current" && type !== "upcoming")
    ) {
      return res
        .status(400)
        .json({ message: "Invalid type parameter or missing date filters." });
    }

    sales = await prisma.sale.findMany({ where: baseQuery });
    res.status(200).json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ message: error.message });
  }
}
