import { prisma } from "@/db/prismaDB";
import { v4 as uuid } from "uuid";
import { AES, enc } from "crypto-ts";

const { Client, Environment } = require("square");

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  try {
    const allIdsToUpdate = [];

    const businesses = await prisma.business.findMany({
      where: { NOT: [{ squareAccessToken: null }] },
    });

    for (const business of businesses) {
      const squareAccessToken = AES.decrypt(
        business?.squareAccessToken,
        process.env.NEXTAUTH_SECRET
      ).toString(enc.Utf8);

      const client = new Client({
        accessToken: squareAccessToken,
        environment: Environment.Sandbox,
      });

      await prisma.listing.updateMany({
        where: {
          id: {
            in: allIdsToUpdate,
          },
        },
        data: {
          isActive: false,
          status: "SOLD",
        },
      });
    }

    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default handler;
