import { MongoClient } from "mongodb";

export async function connectToDatabase() {
  const client = await MongoClient.connect(
    process.env.MONGODB_URI || 'YOUR_LOCAL_MONGODB_URI',
  );
  return client;
}