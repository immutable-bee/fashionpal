import { prisma } from "@/db/prismaDB";
import { AES, enc } from "crypto-ts";

const { Client, Environment } = require("square");

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  try {
    const { email } = req.query;
    const business = await prisma.business.findUnique({
      where: { email },
    });

    if (!business || !business?.squareAccessToken) {
      return res.status(404).json({ message: "Business not found." });
    }

    const squareAccessToken = AES.decrypt(
      business?.squareAccessToken,
      process.env.NEXTAUTH_SECRET
    ).toString(enc.Utf8);

    const client = new Client({
      accessToken: squareAccessToken,
      environment: Environment.Production,
    });

    const response = await client.catalogApi.listCatalog(undefined, "item");
    console.log(response.result);
    res
      .status(200)
      .json(
        JSON.parse(
          JSON.stringify(response?.result?.objects, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
          )
        )
      );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export default handler;
