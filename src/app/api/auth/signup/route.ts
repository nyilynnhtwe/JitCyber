import { connectToDatabase } from "@/app/lib/db";

export  async function POST(req: Request) {
    const { email, password } = await req.json();

    const client = await connectToDatabase();
    const dbName = 'jitcyber';
    const db = client.db(dbName);
    const existingUser = await db.collection("users").findOne({ email });


    if (existingUser) {
        client.close();
        return new Response(JSON.stringify({ data: existingUser }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }

    await db.collection("users").insertOne({
        email,
        password,
    });

    client.close();
    return new Response(JSON.stringify({ data: "User has been regsitered successfully." }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}