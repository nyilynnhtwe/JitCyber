import { COLLECTION_USERS, DB_NAME } from "@/app/constants";
import { connectToDatabase } from "@/lib/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const client = await connectToDatabase();
    const db = client.db(DB_NAME);

    try {
        const skip = (page - 1) * limit;

        const usersCollection = db.collection(COLLECTION_USERS);
        const totalUsers = await usersCollection.countDocuments();

        const users = await usersCollection
            .find({})
            .skip(skip)
            .limit(limit)
            .project({ password: 0 }) // hide password
            .toArray();

        return new Response(JSON.stringify({
            users,
            pagination: {
                total: totalUsers,
                page,
                limit,
                totalPages: Math.ceil(totalUsers / limit),
            }
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Error fetching users:", err);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    } finally {
        client.close();
    }
}
