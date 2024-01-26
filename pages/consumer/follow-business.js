import { prisma } from "../../db/prismaDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const { id } = context.params;

  try {
    const consumer = await prisma.consumer.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    const follow = await prisma.follow.create({
      data: {
        businessId: id,
        consumerId: consumer.id,
      },
    });

    return {
      redirect: {
        destination: `https://fashionpal.app/consumer`,
        permanent: false,
      },
    };
  } catch (error) {}
}

const BusinessPage = () => {
  return <div>Following</div>;
};

export default BusinessPage;
