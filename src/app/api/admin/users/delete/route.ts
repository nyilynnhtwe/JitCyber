// app/api/admin/users/delete.ts
import { connectToDatabase } from "@/lib/db";
import { COLLECTION_USERS, DB_NAME } from "@/app/constants";

export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const client = await connectToDatabase();
  const db = client.db(DB_NAME);

  const result = await db.collection(COLLECTION_USERS).deleteOne({ id });

  client.close();

  if (result.deletedCount === 0) {
    return new Response(JSON.stringify({ error: "User not found or already deleted" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ message: "User deleted successfully" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
