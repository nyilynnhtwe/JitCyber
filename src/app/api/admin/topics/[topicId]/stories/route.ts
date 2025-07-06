import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { COLLECTION_STORIES, DB_NAME } from "@/app/constants";


// GET /api/admin/stories
export async function GET() {
    try {
        const client = await connectToDatabase();
        const db = client.db(DB_NAME);
        const stories = await db
            .collection(COLLECTION_STORIES)
            .find({})
            .toArray();

        return NextResponse.json({ stories }, { status: 200 });
    } catch (err) {
        console.error("Error fetching stories:", err);
        return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
    }
}

export async function POST(req: NextRequest,
    { params }: { params: Promise<{ topicId: string }> }) {
    try {
        const { topicId } = await params;
        const body = await req.json();
        const { title, subtitle, content, lessons = [], createdAt, updatedAt } = body;

        if (!title || !subtitle || !content || !Array.isArray(lessons)) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const client = await connectToDatabase();
        const db = client.db(DB_NAME);

        const result = await db.collection(COLLECTION_STORIES).insertOne({
            title,
            subtitle,
            content, // Assuming content is the same as description
            topicId: topicId, // Ensure topicId is stored as ObjectId
            lessons,
            createdAt: createdAt || new Date().toISOString(),
            updatedAt: updatedAt || new Date().toISOString(),
        });

        return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
    } catch (err) {
        console.error("Error creating story:", err);
        return NextResponse.json({ error: "Failed to create story" }, { status: 500 });
    }
}