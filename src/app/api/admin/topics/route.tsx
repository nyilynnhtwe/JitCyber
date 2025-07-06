import { COLLECTION_TOPICS, DB_NAME } from "@/app/constants";
import { connectToDatabase } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  let client;
  try {
    client = await connectToDatabase();
    const db = client.db(DB_NAME);
    const skip = (page - 1) * limit;

    const topicsCollection = db.collection(COLLECTION_TOPICS);
    const totalTopics = await topicsCollection.countDocuments();

    const topics = await topicsCollection
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();

    return new Response(
      JSON.stringify({
        topics,
        pagination: {
          total: totalTopics,
          page,
          limit,
          totalPages: Math.ceil(totalTopics / limit),
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.log("Error fetching topics:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}



export async function POST(req: Request) {
  const client = await connectToDatabase();
  const db = client.db(DB_NAME);

  try {
    const body = await req.json();
    const { title, description, titleInThai, descInThai } = body;

    if (!title || !description || !titleInThai || !descInThai) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const newTopic = {
      title,
      description,
      titleInThai,
      descInThai,
      quizzesCount: 0,
      storiesCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection(COLLECTION_TOPICS).insertOne(newTopic);

    return new Response(
      JSON.stringify({
        message: "Topic added successfully",
        topic: { ...newTopic, _id: result.insertedId },
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating topic:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    client.close();
  }
}