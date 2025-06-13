import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { DB_NAME,COLLECTION_USERS } from "@/app/constants";
import bcrypt from "bcryptjs";

export const authOptions = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/signin",
        error: "/login-error"
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

                return { id: user.id ,fullName : user.fullname,phone : user.phone};
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.fullName = user.fullName;
                token.phone = user.phone;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = { id: token.id ,phone : token.phone,fullName : token.fullName}; // Ensure session.user is defined
            }
            return session;
        },
    },
};


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };