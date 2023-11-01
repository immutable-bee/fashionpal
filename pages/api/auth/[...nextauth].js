import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../../../db/prismaDB";
import signInEmail from "../../../emails/signin";
import { createTransport } from "nodemailer";

const logo =
  "https://fashionpal.vercel.app/_next/image?url=%2Fimages%2Flogo-vertical.jpg&w=256&q=75";

const transporter = createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,

      sendVerificationRequest: async ({
        identifier: email,
        url,
        provider: { server, from },
      }) => {
        const emailBody = signInEmail.compiledHtml
          .replace(/{{c1}}/g, email)
          .replace(/{{cta1}}/g, url)
          .replace("{{logo}}", logo);

        await transporter.sendMail({
          from: `"FashionPal" <${process.env.EMAIL_FROM}>`,
          to: email,
          subject: "Sign in link",
          html: emailBody,
        });
      },
    }),

    GoogleProvider({
      allowDangerousEmailAccountLinking: true,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
    newUser: "/auth/onboarding",
  },

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account && account.provider === "google") {
        const emailUser = await prisma.user.findUnique({
          where: {
            email: user.email,
          },
        });
        if (emailUser) {
          user.id = emailUser.id;
        }
      }
      return true;
    },
  },
};

export default NextAuth(authOptions);
