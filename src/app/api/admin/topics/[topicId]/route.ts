import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { COLLECTION_TOPICS, COLLECTION_QUIZZES, COLLECTION_STORIES, DB_NAME } from "@/app/constants";
import { ObjectId } from "mongodb";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ topicId: string }> }
) {
    try {
        const { topicId } = await params;
        const { title, description } = await req.json();

        if (!title || !description) {
            return NextResponse.json({ error: "Missing title or description" }, { status: 400 });
        }

        const client = await connectToDatabase();
        const db = client.db(DB_NAME);

        const result = await db
            .collection(COLLECTION_TOPICS)
            .updateOne({ _id: new ObjectId(topicId) }, { $set: { title, description } });

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Topic not found" }, { status: 404 });
        }

        const quizzesCount = await db
            .collection(COLLECTION_QUIZZES)
            .countDocuments({ topicId: new ObjectId(topicId) });

        const storiesCount = await db
            .collection(COLLECTION_STORIES)
            .countDocuments({ topicId: new ObjectId(topicId) });

        return NextResponse.json({
            topic: {
                _id: topicId,
                title,
                description,
                quizzesCount,
                storiesCount,
            },
        });
    } catch (error) {
        console.error("Error updating topic:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}



export async function GET(
    req: Request,
    { params }: { params: Promise<{ topicId: string }> }
) {
    try {
        const { topicId } = await params;

        const client = await connectToDatabase();
        const db = client.db(DB_NAME);

        const topic = await db
            .collection(COLLECTION_TOPICS)
            .findOne({ _id: new ObjectId(topicId) });

        if (!topic) {
            return NextResponse.json({ error: "Topic not found" }, { status: 404 });
        }

        return NextResponse.json({
            topic: {
                _id: topic._id,
                title: topic.title,
                description: topic.description,
            },
        });
    } catch (error) {
        console.error("Error fetching topic:", error);
        return NextResponse.json({ error: "Failed to fetch topic" }, { status: 500 });
    }
}


export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ topicId: string }> }
) {
    try {
        const { topicId } = await params;
        if (!topicId) {
            return NextResponse.json({ error: "Topic ID is required" }, { status: 400 });
        }

        const client = await connectToDatabase();
        const db = client.db(DB_NAME);

        const result = await db
            .collection(COLLECTION_TOPICS)
            .deleteOne({ _id: new ObjectId(topicId) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Topic not found or already deleted" }, { status: 404 });
        }

        return NextResponse.json({ message: "Topic deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting topic:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
