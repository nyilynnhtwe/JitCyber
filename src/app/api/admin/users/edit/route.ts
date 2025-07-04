import { COLLECTION_USERS, DB_NAME } from "@/app/constants";
import { connectToDatabase } from "@/lib/db";
import { UserUpdatePayload } from "@/types/admin";


export async function PUT(req: Request) {
  try {
    const { id, fullname, phone, dob, password, idType } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = await connectToDatabase();
    const db = client.db(DB_NAME);

    const updateFields: UserUpdatePayload = {};
    if (fullname) updateFields.fullname = fullname;
    if (phone) updateFields.phone = phone;
    if (dob) updateFields.dob = dob;
    if (password) updateFields.password = password; // hash if needed
    if (idType) updateFields.idType = idType;

    const result = await db.collection(COLLECTION_USERS).updateOne(
      { id },
      { $set: updateFields }
    );

    client.close();

    if (result.matchedCount === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ data: "User updated successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error updating user:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

