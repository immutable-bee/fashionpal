import { AES, enc } from "crypto-js";
import { prisma } from "../../../../db/prismaDB";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "User is not authenticated" });
  }

  try {
    const business = await prisma.business.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        squareAccessToken: true,
        squareRefreshToken: true,
      },
    });

    if (
      !business ||
      !business.squareAccessToken ||
      !business.squareRefreshToken
    ) {
      return res.status(404).json({
        message: "Business not found or no tokens exist for revocation.",
      });
    }

    const accessToken = AES.decrypt(
      business.squareAccessToken,
      process.env.NEXTAUTH_SECRET
    ).toString(enc.Utf8);
    const refreshToken = AES.decrypt(
      business.squareRefreshToken,
      process.env.NEXTAUTH_SECRET
    ).toString(enc.Utf8);

    const revokeTokenResponse = await fetch(
      "https://connect.squareup.com/oauth2/revoke",
      {
        method: "POST",
        headers: {
          "Square-Version": "2024-01-18",
          Authorization: `Client ${process.env.SQUARE_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.SQUARE_APP_ID,
          access_token: accessToken,
        }),
      }
    );

    if (!revokeTokenResponse.ok) {
      const errorData = await revokeTokenResponse.json();
      throw new Error(
        `Failed to revoke token for business ID: ${business.id}, Error: ${
          errorData.errors ? errorData.errors[0].detail : "Unknown error"
        }`
      );
    }
    const data = await revokeTokenResponse.json();

    if (data.success) {
      await prisma.business.update({
        where: { id: business.id },
        data: {
          squareAccessToken: null,
          squareRefreshToken: null,
          squareTokenIssueDate: null,
        },
      });
    } else {
      return res
        .status(500)
        .json({ message: "Sqaure call was not successful" });
    }

    return res.status(200).json({ message: "Token revoked" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default handler;
