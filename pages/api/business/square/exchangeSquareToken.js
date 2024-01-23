import { prisma } from "../../../../db/prismaDB";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { AES } from "crypto-ts";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  const { code } = req.body;

  const tokenResponse = await fetch(
    "https://connect.squareup.com/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.SQUARE_APP_ID,
        client_secret: process.env.SQUARE_SECRET,
        code: code,
        grant_type: "authorization_code",
      }),
    }
  );

  const data = await tokenResponse.json();

  if (!tokenResponse.ok) {
    return res.status(500).json({ error: "Failed to exchange token" });
  }

  const encryptedAccessToken = AES.encrypt(
    data.access_token,
    process.env.NEXTAUTH_SECRET
  ).toString();
  const encryptedRefreshToken = AES.encrypt(
    data.refresh_token,
    process.env.NEXTAUTH_SECRET
  ).toString();

  const currentDate = new Date().toISOString();

  const business = await prisma.business.update({
    where: { email: session.user.email },
    data: {
      squareAccessToken: encryptedAccessToken,
      squareRefreshToken: encryptedRefreshToken,
      squareTokenIssueDate: currentDate,
    },
  });

  res.status(200).json({ message: "Token exchange successful" });
};

export default handler;
