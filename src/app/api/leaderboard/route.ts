// File: src/app/api/leaderboard/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { DB_NAME } from '@/app/constants';

export async function GET() {
  try {
    const client = await connectToDatabase();
    const db = client.db(DB_NAME);

    const users = await db
      .collection('users')
      .find(
        { scores: { $exists: true, $ne: [] } },
        {
          projection: {
            id: 1,
            fullname: 1,
            scores: 1,
            phone: 1,
          },
        }
      )
      .toArray();

    const leaderboardData = users.map((user) => {
      const totalScore = user.scores.reduce((sum, s) => sum + s.score, 0);
      return {
        userId: user.id.toString(),
        id: user._id.toString(),
        name: user.fullname,
        score: totalScore,
        phone : user.phone || '', // Optional phone number
      };
    });

    // Sort descending by total score
    leaderboardData.sort((a, b) => b.score - a.score);

    return NextResponse.json({ players: leaderboardData });
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
    return new NextResponse('Failed to fetch leaderboard', { status: 500 });
  }
}
