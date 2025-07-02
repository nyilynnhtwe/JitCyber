import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { COLLECTION_QUIZZES, COLLECTION_TOPICS, DB_NAME } from "@/app/constants";
import { ObjectId } from "mongodb";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ topicId: string }> }
) {
  const { topicId } = await params;

  if (!topicId) {
    return NextResponse.json({ error: "Topic ID is required" }, { status: 400 });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db(DB_NAME);
    const quizzesCollection = db.collection(COLLECTION_QUIZZES);

    // Find quizzes where topicId matches
    const filter = { topicId: new ObjectId(topicId) };

    const quizzes = await quizzesCollection
      .find(filter)
      .toArray();

    return NextResponse.json({
      quizzes,
    });
  } catch (err) {
    console.error("Error fetching quizzes for topic:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ topicId: string }> }
) {
  const { topicId } = await params;
  if (!topicId) {
    return NextResponse.json({ error: "Topic ID is required" }, { status: 400 });
  }
  try {
    const client = await connectToDatabase();
    const db = client.db(DB_NAME);
    const body = await req.json();

    // Validate required fields
    const { question, answers, correctAnswerIndex } = body;

    if (
      !question ||
      !Array.isArray(answers) ||
      answers.length < 2 ||
      typeof correctAnswerIndex !== "number" ||
      correctAnswerIndex < 0 ||
      correctAnswerIndex >= answers.length
    ) {
      return NextResponse.json({ error: "Invalid quiz data" }, { status: 400 });
    }

    // Ensure topic exists
    const topic = await db.collection(COLLECTION_TOPICS).findOne({ _id: new ObjectId(topicId) });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Insert the new quiz
    const newQuiz = {
      ...body,
      topicId: new ObjectId(topicId),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(COLLECTION_QUIZZES).insertOne(newQuiz);

    // Update quiz count on topic
    await db.collection(COLLECTION_TOPICS).updateOne(
      { _id: new ObjectId(topicId) },
      {
        $inc: { quizzesCount: 1 },
        $set: { updatedAt: new Date() },
      }
    );

    return NextResponse.json(
      { quiz: { ...newQuiz, _id: result.insertedId } },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating quiz:", err);
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
  }
}