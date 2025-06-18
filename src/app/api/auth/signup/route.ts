import { COLLECTION_USERS, DB_NAME } from "@/app/constants";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: Request) {
    const { email, password, dob } = await req.json();

    const client = await connectToDatabase();
    const db = client.db(DB_NAME);
    const existingUser = await db.collection(COLLECTION_USERS).findOne({ email });


    if (existingUser) {
        client.close();
        return new Response(JSON.stringify({ data: existingUser }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }

    await db.collection(COLLECTION_USERS).insertOne({
        email,
        password,
        dob
    });

    client.close();
    return new Response(JSON.stringify({ data: "User has been regsitered successfully." }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}