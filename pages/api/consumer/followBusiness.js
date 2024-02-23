import { prisma } from "../../../db/prismaDB";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { Client, Environment } from "square";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { businessId, hash } = req.body;

  try {
    const consumer = await prisma.consumer.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!consumer) {
      return res.status(404).json({ message: "Consumer not found" });
    }

    if (!hash) {
      const follow = await prisma.follow.create({
        data: {
          businessId: businessId,
          consumerId: consumer.id,
        },
      });
    } else {
      const tinyUrl = `https://faspl.co/b/${hash}`;
      const business = await prisma.business.findUnique({
        where: {
          tinyUrl: tinyUrl,
        },
        select: {
          id: true,
        },
      });
      const followByUrl = await prisma.follow.create({
        data: {
          businessId: business.id,
          consumerId: consumer.id,
        },
      });
    }

    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { squareAccessToken: true },
    });

    const squareAccessToken = AES.decrypt(
      business.squareAccessToken,
      process.env.NEXTAUTH_SECRET
    ).toString(enc.Utf8);
    const client = new Client({
      accessToken: squareAccessToken,
      environment: Environment.Production,
    });

    const newCustomer = await client.customersApi.createCustomer({
      emailAddress: consumer.email,
      referenceId: consumer.id,
    });

    const customerGroups = await client.customerGroupsApi.listCustomerGroups();

    const groupId = customerGroups.result.groups[0].id;

    const response = await client.customersApi.addGroupToCustomer(
      newCustomer.result.customer.id,
      groupId
    );

    res.status(200).json({ message: "Store successfully followed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
