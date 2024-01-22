import { AES, enc } from "crypto-js";
import { prisma } from "../../../db/prismaDB";
import { verifySignature } from "@upstash/qstash/nextjs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const businesses = await prisma.business.findMany({
      where: {
        squareTokenIssueDate: {
          lt: sevenDaysAgo,
        },
      },
    });

    await Promise.all(
      businesses.map(async (business) => {
        if (!business.squareRefreshToken) return;

        const decryptedRefreshToken = AES.decrypt(
          business.squareRefreshToken,
          process.env.NEXTAUTH_SECRET
        ).toString(enc.Utf8);

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
              refresh_token: decryptedRefreshToken,
              grant_type: "refresh_token",
            }),
          }
        );

        if (!tokenResponse.ok) {
          throw new Error(
            `Failed to refresh token for business ID: ${business.id}`
          );
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

        await prisma.business.update({
          where: { id: business.id },
          data: {
            squareAccessToken: encryptedAccessToken,
            squareRefreshToken: encryptedRefreshToken,
            squareTokenIssueDate: new Date().toISOString(),
          },
        });
      })
    );

    res.status(200).json({ message: "Tokens refreshed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to refresh tokens" });
  }
};

export default verifySignature(handler);
