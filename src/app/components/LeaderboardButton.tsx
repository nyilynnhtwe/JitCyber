import Link from "next/link";
import { Trophy } from "lucide-react";

export function LeaderboardButton() {
    return (
        <Link
            href="/dashboard/user/leaderboard"
            className="inline-flex items-center px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium rounded-lg shadow transition-colors"
        >
            <Trophy className="w-5 h-5 mr-2" />
            View Leaderboard
        </Link>
    );
}
