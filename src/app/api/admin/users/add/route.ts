import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { hash } from "bcryptjs";
import { COLLECTION_USERS, DB_NAME } from "@/app/constants";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { fullname, idType, id, phone, dob, password } = body;

        if (!fullname || !idType || !id || !phone || !dob || !password) {
            return NextResponse.json({ error: "All fields are required." }, { status: 400 });
        }

        const client = await connectToDatabase();
        const db = client.db(DB_NAME);

        // Check for existing user
        const existingUser = await db
            .collection(COLLECTION_USERS)
            .findOne({ id });

        if (existingUser) {
            return NextResponse.json({ error: "User with this ID already exists." }, { status: 400 });
        }

        const hashedPassword = await hash(password, 10); // secure hash

        const newUser = {
            fullname,
            idType,
            id,
            phone,
            dob,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        };

        const result = await db.collection(COLLECTION_USERS).insertOne(newUser);

        return NextResponse.json(
            {
                message: "User added successfully",
                user: {
                    _id: result.insertedId.toString(),
                    ...newUser,
                    password: undefined, // never return password
                },
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("API Add User Error:", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
