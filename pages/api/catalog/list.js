import { prisma } from "@/db/prismaDB";
import { v4 as uuid } from "uuid";

const { Client, Environment, ApiError } = require("square");

const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  try {
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
