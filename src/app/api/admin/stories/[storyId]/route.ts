import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { COLLECTION_STORIES, COLLECTION_TOPICS, DB_NAME } from "@/app/constants";
import { ObjectId } from "mongodb";

// PUT /api/admin/stories/:storyId
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ storyId: string }> }
) {
    const { storyId } = await params;

    if (!ObjectId.isValid(storyId)) {
        return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    try {
        const client = await connectToDatabase();
        const db = client.db(DB_NAME);
        const body = await req.json();

        const { title, subtitle, description, content, lessons, topicId } = body;

        // Validate required fields
        if (!title || !content || !Array.isArray(lessons) || lessons.length === 0) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Validate each lesson
        for (const lesson of lessons) {
            if (!lesson.content || typeof lesson.content !== "string") {
                return NextResponse.json({ error: "Invalid lesson format" }, { status: 400 });
            }
        }

        const result = await db.collection(COLLECTION_STORIES).updateOne(
            { _id: new ObjectId(storyId) },
            {
                $set: {
                    title,
                    subtitle: subtitle || "",
                    description: description || "",
                    content,
                    lessons,
                    topicId: new ObjectId(topicId),
                    updatedAt: new Date(),
                },
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Story not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Story updated successfully" });
    } catch (err) {
        console.error("Error updating story:", err);
        return NextResponse.json(
            { error: "Failed to update story" },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/stories/:storyId
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ storyId: string }> }
) {
    const { storyId } = await params;

    if (!ObjectId.isValid(storyId)) {
        return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    try {
        const client = await connectToDatabase();
        const db = client.db(DB_NAME);

        // First get the story to retrieve topicId
        const story = await db.collection(COLLECTION_STORIES).findOne({
            _id: new ObjectId(storyId),
        });

        if (!story) {
            return NextResponse.json({ error: "Story not found" }, { status: 404 });
        }

        const topicId = story.topicId;

        // Delete the story
        const result = await db.collection(COLLECTION_STORIES).deleteOne({
            _id: new ObjectId(storyId),
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: "Story not found or already deleted" },
                { status: 404 }
            );
        }

        // Update topic's stories count
        await db.collection(COLLECTION_TOPICS).updateOne(
            { _id: new ObjectId(topicId) },
            {
                $inc: { storiesCount: -1 },
                $set: { updatedAt: new Date() },
            }
        );

        return NextResponse.json({ message: "Story deleted successfully" });
    } catch (err) {
        console.error("Error deleting story:", err);
        return NextResponse.json(
            { error: "Failed to delete story" },
            { status: 500 }
        );
    }
}

// GET /api/admin/stories/:storyId
export async function GET(
    req: Request,
    { params }: { params: Promise<{ storyId: string }> }
) {
    const { storyId } = await params;

    if (!ObjectId.isValid(storyId)) {
        return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    try {
        const client = await connectToDatabase();
        const db = client.db(DB_NAME);

        const story = await db.collection(COLLECTION_STORIES).findOne({
            _id: new ObjectId(storyId),
        });

        if (!story) {
            return NextResponse.json({ error: "Story not found" }, { status: 404 });
        }

        // Convert ObjectId to string for client
        const response = {
            ...story,
            _id: story._id.toString(),
            topicId: story.topicId.toString()
        };

        return NextResponse.json(response);
    } catch (err) {
        console.error("Error fetching story:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}