import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from '../../../prisma/client';

const options = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            async authorize(credentials, req) {
                console.log(credentials)
                const userCredentials = {
                    email: credentials.email,
                    password: credentials.password,
                };
                console.log(1)
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/user/login`,
                    {
                        method: "POST",
                        body: JSON.stringify(userCredentials),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                console.log(res.status); // Log the HTTP status code
                console.log(res.statusText); // Log the status text (e.g., "Not Found" for a 404 error)

                console.log(2)
                console.log(res)
                const user = await res.json();
                console.log(res)
                if (res.ok && user) {
                    return user;
                } else {
                    return null;
                }
            },
        }),
    ],

    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt", maxAge: 24 * 60 * 60 },

    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        maxAge: 60 * 60 * 24 * 30,
        encryption: true,
    },

    pages: {
        signIn: "/login",
        signOut: "/login",
        error: "/login",
    },

    callbacks: {
        async session(session, user, token) {
            if (user !== null) {

                session.user = user;
            }
            return await session;
        },

        async jwt({ token, user }) {
            return await token;
        },
    },
};

export default (req, res) => NextAuth(req, res, options);