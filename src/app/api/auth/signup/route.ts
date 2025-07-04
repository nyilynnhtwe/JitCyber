import { COLLECTION_USERS, DB_NAME } from "@/app/constants";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { id, fullname, password, phone, dob, idType } = await req.json();

    if (!id || !fullname || !password || !phone || !dob || !idType) {
      return new Response(
        JSON.stringify({ message: "Missing required fields." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = await connectToDatabase();
    const db = client.db(DB_NAME);

    const existingUser = await db.collection(COLLECTION_USERS).findOne({ id });

    if (existingUser) {
      client.close();
      return new Response(JSON.stringify({ message: "User already exists." }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newUser = {
      id,
      idType,
      fullname,
      phone,
      dob,
      password,
      createdAt: new Date(),
    };

    await db.collection(COLLECTION_USERS).insertOne(newUser);
    client.close();

    return new Response(
      JSON.stringify({ message: "User registered successfully." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Signup API Error:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
