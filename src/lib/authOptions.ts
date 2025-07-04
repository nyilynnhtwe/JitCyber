// src/lib/authOptions.ts
import { AuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { DB_NAME, COLLECTION_USERS } from "@/app/constants";

export const authOptions: AuthOptions = {
    session: {
        strategy: "jwt" as SessionStrategy,
    },
    pages: {
        signIn: "/signin",
        error: "/login-error",
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                id: { label: "ID", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.id || !credentials?.password) {
                    throw new Error("Missing credentials");
                }

                const client = await connectToDatabase();
                const db = client.db(DB_NAME);

                const user = await db.collection(COLLECTION_USERS).findOne({
                    id: credentials.id,
                });

                client.close();

                if (!user) {
                    throw new Error("No user found!");
                }

                const isValid = await verifyPassword(
                    credentials.password,
                    user.password
                );
                if (!isValid) {
                    throw new Error("Could not log you in!");
                }

                return {
                    id: user.id,
                    fullname: user.fullname,
                    phone: user.phone,
                    dob: user.dob,
                    scores : user.scores || [], // Ensure scores is always an array
                } as {
                    id: string;
                    fullname: string;
                    phone: string;
                    dob: string;
                    scores: Record<string, number>[]; // Adjust type as needed
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.fullname = user.fullname;
                token.phone = user.phone;
                token.dob = user.dob;
                token.scores = user.scores || []; 
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id as string,
                    fullname: token.fullname as string,
                    phone: token.phone as string,
                    dob: token.dob as string,
                    scores: Array.isArray(token.scores) ? token.scores : [],
                };
            }
            return session;
        },
    },
};
