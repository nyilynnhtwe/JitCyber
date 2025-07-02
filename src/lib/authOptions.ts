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
                    fullName: user.fullname,
                    phone: user.phone,
                    dob: user.dob,
                } as {
                    id: string;
                    fullName: string;
                    phone: string;
                    dob: string;
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.fullName = user.fullName;
                token.phone = user.phone;
                token.dob = user.dob; // Include DOB if needed
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id as string,
                    fullName: token.fullName as string,
                    phone: token.phone as string,
                    dob: token.dob as string, // Include DOB if needed
                };
            }
            return session;
        },
    },
};
