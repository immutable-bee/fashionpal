import { getServerSession } from "next-auth";
import { prisma } from "../../../../../db/prismaDB";
import { authOptions } from "../../../auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const data = req.body;

  try {
    const updatedList = await prisma.ThriftList.update({
      where: { id: data.id },
      data: { isChecked: data.isChecked },
    });

    return res
      .status(200)
      .json({ message: "List Item record updatesd: ", updatedList });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default handler;
