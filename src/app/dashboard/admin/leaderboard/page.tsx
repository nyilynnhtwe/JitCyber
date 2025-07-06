"use client";

import React from "react";
import { ChevronDown, ChevronUp, BarChart2, Loader } from "lucide-react";
import { Player, RankedPlayer } from "@/types/general";

const AdminLeaderboardPage = () => {
    const [players, setPlayers] = React.useState<Player[]>([]);
    const [expanded, setExpanded] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch("/api/leaderboard");
                const data = await res.json();
                setPlayers(data.players || []);
            } catch (err) {
                console.error("Failed to fetch leaderboard:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    const rankedPlayers: RankedPlayer[] = React.useMemo(() => {
        if (players.length === 0) return [];

        const sorted = [...players].sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.name.localeCompare(b.name);
        });

        let rank = 1;
        let prevScore = sorted[0]?.score;
        return sorted.map((player, index) => {
            if (player.score !== prevScore) {
                rank = index + 1;
                prevScore = player.score;
            }
            return { ...player, rank };
        });
    }, [players]);


    // Medal colors for top 3 positions
    const getRankColor = (rank: number) => {
        if (rank === 1) return "bg-yellow-100 text-yellow-800 border-yellow-200";
        if (rank === 2) return "bg-gray-100 text-gray-800 border-gray-200";
        if (rank === 3) return "bg-amber-100 text-amber-800 border-amber-200";
        return "";
    };

    return (
        <div className="min-h-screen px-4 py-8 bg-gray-50 sm:px-6">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 flex justify-center items-center">
                        <BarChart2 className="mr-2 text-blue-600" size={32} />
                        Admin Leaderboard
                    </h1>
                    <p className="text-gray-600 mt-2">Manage all player scores</p>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    <div className="grid grid-cols-12 gap-2 bg-gray-100 p-4 text-sm font-medium text-gray-700">
                        <div className="col-span-1">Rank</div>
                        <div className="col-span-5 sm:col-span-4">Name</div>
                        <div className="col-span-3 sm:col-span-3">Phone</div>
                        <div className="col-span-2 text-right">Score</div>
                        {/* <div className="col-span-1 text-center">Actions</div> */}
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center p-8">
                            <Loader className="animate-spin text-blue-500" size={30} />
                        </div>
                    ) : players.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No player data available
                        </div>
                    ) : (
                        <>
                            {rankedPlayers
                                .slice(0, expanded ? rankedPlayers.length : 10)
                                .map((player) => (
                                    <div
                                        key={player.id}
                                        className={`grid grid-cols-12 gap-2 p-4 text-sm border-t items-center transition-colors hover:bg-gray-50 ${getRankColor(player.rank)}`}
                                    >
                                        <div className="col-span-1 font-medium">
                                            {player.rank <= 3 ? (
                                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-opacity-30">
                                                    {player.rank}
                                                </span>
                                            ) : (
                                                player.rank
                                            )}
                                        </div>
                                        <div className="col-span-5 sm:col-span-4 font-medium truncate">
                                            {player.name}
                                        </div>
                                        <div className="col-span-3 sm:col-span-3 text-gray-600 truncate">
                                            {player.phone || "N/A"}
                                        </div>
                                        <div className="col-span-2 text-right font-semibold">
                                            {player.score}
                                        </div>
                                        {/* <div className="col-span-1 flex justify-center">
                                            <button
                                                onClick={() => handleDelete(player.id)}
                                                className="text-red-500 hover:text-red-700 transition"
                                                aria-label="Delete player"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div> */}
                                    </div>
                                ))}

                            {rankedPlayers.length > 10 && (
                                <button
                                    onClick={() => setExpanded(!expanded)}
                                    className="w-full py-3 text-blue-600 bg-gray-50 hover:bg-gray-100 border-t text-sm flex items-center justify-center font-medium transition-colors"
                                >
                                    {expanded ? (
                                        <>
                                            <ChevronUp className="mr-2" size={18} />
                                            Show Less
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="mr-2" size={18} />
                                            Show More
                                        </>
                                    )}
                                    <span className="ml-2 bg-gray-200 rounded-full px-2 py-0.5 text-xs">
                                        {expanded ? players.length : players.length - 10}+
                                    </span>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminLeaderboardPage;