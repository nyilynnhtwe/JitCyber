import { COLLECTION_USERS, COLLECTION_TOPICS, DB_NAME } from "@/app/constants";
import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; // Ensure fresh data on every request

export async function GET() {
  const client = await connectToDatabase();
  const db = client.db(DB_NAME);

  try {
    // Get real user count
    const usersCollection = db.collection(COLLECTION_USERS);
    const userCount = await usersCollection.countDocuments();
    
    // Get real topic count
    const topicsCollection = db.collection(COLLECTION_TOPICS);
    const topicCount = await topicsCollection.countDocuments();
    
    // Generate sample session data (random between 500-1500)
    const sessionData = Math.floor(Math.random() * 1000) + 500;
    
    // Generate sample message data (random between 2000-7000)
    const messageData = Math.floor(Math.random() * 5000) + 2000;
    
    // Calculate session growth percentage (random 5-25%)
    const sessionGrowth = Math.floor(Math.random() * 20) + 5;
    
    // Calculate message growth percentage (random 10-40%)
    const messageGrowth = Math.floor(Math.random() * 30) + 10;
    
    return NextResponse.json({
      users: userCount,
      topics: topicCount,
      sessions: sessionData,
      messages: messageData,
      sessionGrowth,
      messageGrowth,
      status: "success"
    });
    
  } catch (error) {
    console.error("[ADMIN_STATS_ERROR]", error);
    return NextResponse.json({
      users: 0,
      topics: 0,
      sessions: 0,
      messages: 0,
      sessionGrowth: 0,
      messageGrowth: 0,
      status: "error",
      message: "Failed to fetch stats"
    }, { status: 500 });
  } finally {
    await client.close();
  }
}