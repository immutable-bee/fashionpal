import { prisma } from "../../../../db/prismaDB";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { AES } from "crypto-js";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  const { code } = req.body;

  try {
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

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Token exchange error:", errorData);
      const errorMessage =
        errorData.error_description ||
        "Unknown error occurred during token exchange.";
      return res.status(tokenResponse.status).json({ error: errorMessage });
    }

    const data = await tokenResponse.json();

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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
