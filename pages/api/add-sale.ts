import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const payload: any = req.body;

      // Ensure items are stored as an array
      if (payload.items && typeof payload.items === "string") {
        payload.items = JSON.parse(payload.items);
      }

      const data = await prisma.sale.create({
        data: payload,
      });

      res.status(200).json(data);
    } catch (error) {
      console.error("Error creating sale:", error);
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
