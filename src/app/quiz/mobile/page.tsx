"use client"
import { Trophy, ChevronDown, ChevronUp, Medal, Sparkles } from 'lucide-react';
import { useState } from 'react';

const Leaderboard = () => {
  const [showAll, setShowAll] = useState(false);

  // Mock data
  const topPlayers = [
    { id: 1, name: 'Alex Johnson', score: 9850, trend: 'up' },
    { id: 2, name: 'Sam Wilson', score: 8720, trend: 'down' },
    { id: 3, name: 'Taylor Swift', score: 8450, trend: 'up' },
  ];

  const otherPlayers = [
    { id: 4, name: 'Jamie Lee', score: 8120, trend: 'up' },
    { id: 5, name: 'Chris Evans', score: 7950, trend: 'down' },
    { id: 6, name: 'Morgan Freeman', score: 7820, trend: 'new' },
    { id: 7, name: 'Diana Prince', score: 7650, trend: 'up' },
    { id: 8, name: 'Bruce Wayne', score: 7420, trend: 'down' },
  ];

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-blue-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Live Leaderboard
          </h2>
          <div className="flex items-center gap-1 text-sm bg-blue-700 px-2 py-1 rounded-full">
            <Sparkles className="w-4 h-4" />
            <span>Active</span>
          </div>
        </div>
      </div>

      {/* Podium */}
      <div className="flex justify-center items-end h-52 px-4 gap-2 mt-2">
        {/* 2nd Place */}
        <div className="flex-1 max-w-24 bg-blue-400 rounded-t-lg h-40 flex flex-col items-center justify-end pb-2">
          <Medal className="text-blue-800 mb-1 w-5 h-5" />
          <span className="text-white font-bold text-lg">2</span>
          <div className="bg-white rounded w-full mx-1 p-2 mt-2 text-center">
            <p className="font-semibold text-blue-800 text-sm truncate">{topPlayers[1].name}</p>
            <p className="text-blue-600 font-bold text-sm">{topPlayers[1].score.toLocaleString()}</p>
          </div>
        </div>

        {/* 1st Place */}
        <div className="flex-1 max-w-28 bg-blue-500 rounded-t-lg h-48 flex flex-col items-center justify-end pb-2">
          <Trophy className="text-yellow-400 mb-1 w-6 h-6" />
          <span className="text-white font-bold text-xl">1</span>
          <div className="bg-white rounded w-full mx-1 p-2 mt-2 text-center">
            <p className="font-semibold text-blue-800 text-sm truncate">{topPlayers[0].name}</p>
            <p className="text-blue-600 font-bold text-sm">{topPlayers[0].score.toLocaleString()}</p>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="flex-1 max-w-24 bg-blue-300 rounded-t-lg h-32 flex flex-col items-center justify-end pb-2">
          <Medal className="text-blue-700 mb-1 w-5 h-5" />
          <span className="text-white font-bold text-lg">3</span>
          <div className="bg-white rounded w-full mx-1 p-2 mt-2 text-center">
            <p className="font-semibold text-blue-800 text-sm truncate">{topPlayers[2].name}</p>
            <p className="text-blue-600 font-bold text-sm">{topPlayers[2].score.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Players List */}
      <div className="p-4">
        <ul className="divide-y divide-gray-200">
          {topPlayers.map((player, index) => (
            <li key={player.id} className="py-3 flex items-center">
              <span className={`font-bold w-6 text-center ${index === 0 ? 'text-blue-600' : 'text-gray-500'}`}>
                {index + 1}
              </span>
              <p className="ml-3 flex-1 font-medium text-gray-900 truncate">{player.name}</p>
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-600">{player.score.toLocaleString()}</span>
                {player.trend === 'up' ? (
                  <ChevronUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-red-500" />
                )}
              </div>
            </li>
          ))}

          {showAll && otherPlayers.map((player) => (
            <li key={player.id} className="py-3 flex items-center">
              <span className="font-bold w-6 text-center text-gray-500">{player.id}</span>
              <p className="ml-3 flex-1 font-medium text-gray-900 truncate">{player.name}</p>
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-600">{player.score.toLocaleString()}</span>
                {player.trend === 'up' ? (
                  <ChevronUp className="w-4 h-4 text-green-500" />
                ) : player.trend === 'down' ? (
                  <ChevronDown className="w-4 h-4 text-red-500" />
                ) : (
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                )}
              </div>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-2 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium flex items-center justify-center gap-1 transition-colors"
        >
          {showAll ? 'Show Less' : 'See More Competitors'}
          {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;