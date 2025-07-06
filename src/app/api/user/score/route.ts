// File: /app/api/user/score/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { COLLECTION_USERS, DB_NAME } from "@/app/constants";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";


export async function PATCH(req: NextRequest) {
  let client;
  try {
    const { topicId, score, userId } = await req.json();

    if (!topicId || score === undefined || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    client = await connectToDatabase();
    const db = client.db(DB_NAME);
    const usersCollection = db.collection(COLLECTION_USERS); // 👈 set the type here

    // First, try to insert if the topic doesn't exist
    const insertResult = await usersCollection.updateOne(
      { id: userId, "scores.topicId": { $ne: topicId } },
      {
        $push: {
          scores: {
            topicId,
            score,
          },
        },
      }
    );

    // If already exists, update it
    if (insertResult.matchedCount === 0) {
      await usersCollection.updateOne(
        { id: userId, "scores.topicId": topicId },
        {
          $set: { "scores.$.score": score },
        }
      );
    }

    return NextResponse.json({ message: "Score updated successfully" }, { status: 200 });
  } catch (err) {
    console.error("Error updating score:", err);
    return NextResponse.json({ error: "Failed to update score" }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}

export async function GET() {
  let client;
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    client = await connectToDatabase();
    const db = client.db(DB_NAME);
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne(
      { id: session.user.id },
      { projection: { scores: 1, _id: 0 } }
    );

    return NextResponse.json({ scores: user?.scores || [] }, { status: 200 });
  } catch (err) {
    console.error("Error fetching scores:", err);
    return NextResponse.json({ error: "Failed to fetch scores" }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}