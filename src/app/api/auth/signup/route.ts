import { COLLECTION_USERS, DB_NAME } from "@/app/constants";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: Request) {
<<<<<<< HEAD
    const { email, password, dob } = await req.json();

=======
    const { id, fullname, password, phone } = await req.json();
>>>>>>> 7e37c485e2c534c54404e555987577ae4ad02459
    const client = await connectToDatabase();
    const db = client.db(DB_NAME);
    const existingUser = await db.collection(COLLECTION_USERS).findOne({ id });

    if (existingUser) {
        client.close();
        return new Response(JSON.stringify({ data: 'User already exists' }), {
            status: 409,
            headers: { "Content-Type": "application/json" },
        });
    }

    await db.collection(COLLECTION_USERS).insertOne({
        id,
        fullname,
        phone,
        password,
        dob
    });

    client.close();
    return new Response(JSON.stringify({ data: "User has been registered successfully." }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}