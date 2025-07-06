import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { COLLECTION_QUIZZES, COLLECTION_TOPICS, DB_NAME } from "@/app/constants";
import { ObjectId } from "mongodb";

// GET /api/admin/topics/:topicId/quizzes/:quizId
export async function GET(
  req: Request,
  { params }: { params: Promise<{ topicId: string; quizId: string }> }
) {
  const { topicId, quizId } = await params;

  if (!ObjectId.isValid(topicId) || !ObjectId.isValid(quizId)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }
  let client;
  try {
    client = await connectToDatabase();
    const db = client.db(DB_NAME);

    const quiz = await db.collection(COLLECTION_QUIZZES).findOne({
      _id: new ObjectId(quizId),
      topicId: new ObjectId(topicId),
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json(quiz);
  } catch (err) {
    console.error("Error fetching quiz:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// PUT /api/admin/topics/:topicId/quizzes/:quizId
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ topicId: string; quizId: string }> }
) {
  const { topicId, quizId } = await params;

  if (!ObjectId.isValid(topicId) || !ObjectId.isValid(quizId)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }
  let client;
  try {
    client = await connectToDatabase();
    const db = client.db(DB_NAME);
    const body = await req.json();

    const { question, answers, correctAnswerIndex, explanation } = body;

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

    const result = await db.collection(COLLECTION_QUIZZES).updateOne(
      { _id: new ObjectId(quizId), topicId: new ObjectId(topicId) },
      {
        $set: {
          question,
          answers,
          correctAnswerIndex,
          explanation: explanation || "",
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Quiz updated successfully" });
  } catch (err) {
    console.error("Error updating quiz:", err);
    return NextResponse.json({ error: "Failed to update quiz" }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// DELETE /api/admin/topics/:topicId/quizzes/:quizId
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ topicId: string; quizId: string }> }
) {
  const { topicId, quizId } = await params;

  if (!ObjectId.isValid(topicId) || !ObjectId.isValid(quizId)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }
  let client;
  try {
    client = await connectToDatabase();
    const db = client.db(DB_NAME);

    const result = await db.collection(COLLECTION_QUIZZES).deleteOne({
      _id: new ObjectId(quizId),
      topicId: new ObjectId(topicId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Quiz not found or already deleted" }, { status: 404 });
    }

    await db.collection(COLLECTION_TOPICS).updateOne(
      { _id: new ObjectId(topicId) },
      {
        $inc: { quizzesCount: -1 },
        $set: { updatedAt: new Date() },
      }
    );

    return NextResponse.json({ message: "Quiz deleted successfully" });
  } catch (err) {
    console.error("Error deleting quiz:", err);
    return NextResponse.json({ error: "Failed to delete quiz" }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
