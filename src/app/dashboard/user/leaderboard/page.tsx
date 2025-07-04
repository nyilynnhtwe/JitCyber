"use client";

import React from "react";
import {
    Trophy,
    ChevronDown,
    ChevronUp,
    Crown,
    Medal,
    Award,
    Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Player, RankedPlayer } from "@/types/general";

const LeaderboardPage = () => {
    const [expanded, setExpanded] = React.useState(false);
    const [players, setPlayers] = React.useState<Player[]>([]);

    React.useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch('/api/leaderboard');
                const data = await res.json();
                setPlayers(data.players || []);
            } catch (err) {
                console.error('Failed to fetch leaderboard:', err);
            }
        };
        fetchLeaderboard();
    }, []);


    const { topPlayers, otherPlayers }: {
        topPlayers: RankedPlayer[];
        otherPlayers: RankedPlayer[];
    } = React.useMemo(() => {
        if (players.length === 0) return { topPlayers: [], otherPlayers: [] };

        const sorted = [...players].sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.name.localeCompare(b.name);
        });

        let currentRank = 1;
        let prevScore = sorted[0]?.score;
        const rankedPlayers = sorted.map((player, index) => {
            if (player.score !== prevScore) {
                currentRank = index + 1;
                prevScore = player.score;
            }
            return { ...player, rank: currentRank };
        });

        return {
            topPlayers: rankedPlayers.slice(0, 3),
            otherPlayers: rankedPlayers.slice(3),
        };
    }, [players]);


    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 relative">
                    <div className="absolute -top-2 -left-4 opacity-20">
                        <Sparkles className="text-yellow-500" size={24} />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center">
                        <Trophy className="mr-3 text-yellow-500" size={36} />
                        <span>Leaderboard</span>
                    </h1>
                    <p className="mt-3 text-gray-600 font-medium">
                        Top performers for the Quiz
                    </p>
                    <div className="absolute -bottom-2 -right-4 opacity-20">
                        <Sparkles className="text-yellow-500" size={24} />
                    </div>
                </div>

                {/* Podium */}
                <div className="flex justify-center items-end space-x-4 mb-16">
                    {/* 2nd place - Silver */}
                    <div className="flex flex-col items-center w-1/4 transition-all duration-300 hover:scale-[1.02]">
                        <div className="bg-gray-200 rounded-t-lg p-4 w-full flex justify-center h-32 relative">
                            <span className="text-4xl font-bold text-gray-700">2</span>
                            <div className="absolute top-2 right-3">
                                <Medal className="text-gray-500" size={24} />
                            </div>
                        </div>
                        <div className="bg-white p-4 w-full text-center shadow-lg rounded-b-lg border-t-4 border-gray-300">
                            <h3 className="font-semibold text-gray-800">
                                {topPlayers[1]?.name || "N/A"}
                            </h3>
                            <p className="text-gray-700 font-medium">
                                {topPlayers[1]?.score.toLocaleString() || "0"}
                            </p>
                        </div>
                    </div>

                    {/* 1st place - Gold */}
                    <div className="flex flex-col items-center w-1/3 transition-all duration-300 hover:scale-[1.02]">
                        <div className="bg-gradient-to-b from-yellow-200 to-yellow-100 rounded-t-lg p-4 w-full flex justify-center h-40 relative">
                            <span className="text-4xl font-bold text-yellow-800">1</span>
                            <div className="absolute top-2 right-4">
                                <Crown className="text-yellow-600" size={28} />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30 animate-shine"></div>
                        </div>
                        <div className="bg-white p-4 w-full text-center shadow-xl rounded-b-lg border-t-4 border-yellow-400">
                            <h3 className="font-bold text-yellow-800 text-lg">
                                {topPlayers[0]?.name || "N/A"}
                            </h3>
                            <p className="text-yellow-700 font-bold text-lg">
                                {topPlayers[0]?.score.toLocaleString() || "0"}
                            </p>
                        </div>
                    </div>

                    {/* 3rd place - Bronze */}
                    <div className="flex flex-col items-center w-1/4 transition-all duration-300 hover:scale-[1.02]">
                        <div className="bg-orange-100 rounded-t-lg p-4 w-full flex justify-center h-24 relative">
                            <span className="text-4xl font-bold text-orange-800">3</span>
                            <div className="absolute top-2 right-3">
                                <Award className="text-orange-600" size={24} />
                            </div>
                        </div>
                        <div className="bg-white p-4 w-full text-center shadow-lg rounded-b-lg border-t-4 border-orange-700">
                            <h3 className="font-semibold text-orange-800">
                                {topPlayers[2]?.name || "N/A"}
                            </h3>
                            <p className="text-orange-700 font-medium">
                                {topPlayers[2]?.score.toLocaleString() || "0"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Other competitors */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    <div className="divide-y divide-gray-200">
                        {otherPlayers
                            .slice(0, expanded ? otherPlayers.length : 3)
                            .map((player) => (
                                <div
                                    key={player.id}
                                    className="p-4 hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <span
                                                className={`w-8 text-center font-medium ${player.rank === 1
                                                    ? "text-yellow-500"
                                                    : player.rank === 2
                                                        ? "text-gray-500"
                                                        : player.rank === 3
                                                            ? "text-amber-600"
                                                            : "text-gray-600"
                                                    }`}
                                            >
                                                {player.rank}
                                            </span>
                                            <span className="ml-4 font-medium text-gray-800 group-hover:text-gray-700 transition-colors">
                                                {player.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-gray-700 font-medium">
                                                {player.score.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {otherPlayers.length > 3 && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium flex items-center justify-center transition-all group border-t border-gray-200"
                        >
                            {expanded ? (
                                <>
                                    <ChevronUp className="mr-2 group-hover:-translate-y-0.5 transition-transform" size={18} />
                                    Show Less
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="mr-2 group-hover:translate-y-0.5 transition-transform" size={18} />
                                    See More Competitors
                                </>
                            )}
                        </button>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-gray-500 text-sm flex items-center justify-center">
                    <span className="h-px w-8 bg-gray-300 mr-3"></span>
                    Keep practicing and see yourself on the leaderboard!
                    <span className="h-px w-8 bg-gray-300 ml-3"></span>
                </div>

                {/* Bottom Back to Learn Link */}
                <div className="mt-8 flex justify-center">
                    <Link
                        href="/dashboard/user"
                        className="inline-flex items-center px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg shadow transition-colors"
                    >
                        <svg
                            className="w-5 h-5 mr-2 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            {/* Animation style */}
            <style jsx>{`
                @keyframes shine {
                    0% {
                        transform: translateX(-100%) rotate(15deg);
                    }
                    100% {
                        transform: translateX(100%) rotate(15deg);
                    }
                }
                .animate-shine {
                    animation: shine 3s infinite;
                }
            `}</style>
        </div>
    );
};

export default LeaderboardPage;