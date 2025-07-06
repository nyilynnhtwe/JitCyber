import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { COLLECTION_STORIES, DB_NAME } from "@/app/constants";
import { ObjectId } from "mongodb";



export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ topicId: string }> }
) {
    let client;
    try {
        const { topicId } = await params;
        client = await connectToDatabase();
        const db = client.db(DB_NAME);
        const stories = await db
            .collection(COLLECTION_STORIES)
            .find({ topicId })
            .toArray();

        return NextResponse.json({ stories }, { status: 200 });
    } catch (err) {
        console.error("Error fetching stories:", err);
        return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
    }
    finally {
        if (client) {
            await client.close();
        }
    }
}



export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ topicId: string }> }
) {
    let client;
    try {
        const { topicId } = await params;
        if (!ObjectId.isValid(topicId)) {
            return NextResponse.json({ error: "Invalid topicId format" }, { status: 400 });
        }

        const body = await req.json();
        const { title, subtitle = { en: "", th: "" }, content, lessons = [] } = body;

        // Validate multilingual required fields
        if (
            !title?.en?.trim() ||
            !title?.th?.trim() ||
            !content?.en?.trim() ||
            !content?.th?.trim()
        ) {
            return NextResponse.json({ error: "Missing required multilingual fields" }, { status: 400 });
        }

        if (!Array.isArray(lessons) || lessons.length === 0) {
            return NextResponse.json({ error: "At least one lesson is required" }, { status: 400 });
        }

        for (const [index, lesson] of lessons.entries()) {
            if (
                !lesson?.content?.en?.trim() ||
                !lesson?.content?.th?.trim()
            ) {
                return NextResponse.json(
                    { error: `Lesson ${index + 1} is missing required content` },
                    { status: 400 }
                );
            }
        }

        const client = await connectToDatabase();
        const db = client.db(DB_NAME);

        // Insert story
        const now = new Date();
        const result = await db.collection(COLLECTION_STORIES).insertOne({
            title,
            subtitle,
            content,
            topicId: new ObjectId(topicId),
            lessons,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
        });

        // Increment storiesCount in topics collection
        await db.collection("topics").updateOne(
            { _id: new ObjectId(topicId) },
            { $inc: { storiesCount: 1 } }
        );

        return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
    } catch (err) {
        console.error("Error creating story:", err);
        return NextResponse.json({ error: "Failed to create story" }, { status: 500 });
    }
    finally {
        if (client) {
            await client.close();
        }
    }
}