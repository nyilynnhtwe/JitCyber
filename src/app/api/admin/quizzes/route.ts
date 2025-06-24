import { COLLECTION_QUIZZES, DB_NAME } from "@/app/constants";
import { connectToDatabase } from "@/lib/db";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const client = await connectToDatabase();
    const db = client.db(DB_NAME);

    try {
        const skip = (page - 1) * limit;

        const quizzesCollection = db.collection(COLLECTION_QUIZZES);
        const totalQuizzes = await quizzesCollection.countDocuments();

        const quizzes = await quizzesCollection
            .find({})
            .skip(skip)
            .limit(limit)
            .toArray();

        return new Response(JSON.stringify({
            quizzes,
            pagination: {
                total: totalQuizzes,
                page,
                limit,
                totalPages: Math.ceil(totalQuizzes / limit),
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
