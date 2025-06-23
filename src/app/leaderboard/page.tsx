'use client';
import React from 'react';
import { Trophy, ChevronDown, ChevronUp, Medal, Sparkles } from 'lucide-react';

const Leaderboard = () => {
  const [showAll, setShowAll] = React.useState(false);
  
  const topCompetitors = [
    { id: 1, name: 'Alex Johnson', score: 9850, change: 'up' },
    { id: 2, name: 'Sam Wilson', score: 8720, change: 'down' },
    { id: 3, name: 'Taylor Swift', score: 8450, change: 'up' },
  ];
  
  const otherCompetitors = [
    { id: 4, name: 'Jamie Lee', score: 8120, change: 'up' },
    { id: 5, name: 'Chris Evans', score: 7950, change: 'down' },
    { id: 6, name: 'Morgan Freeman', score: 7820, change: 'up' },
    { id: 7, name: 'Diana Prince', score: 7650, change: 'new' },
    { id: 8, name: 'Bruce Wayne', score: 7420, change: 'down' },
  ];

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center">
            <Trophy className="mr-2" size={24} />
            Leaderboard
          </h2>
          <div className="flex items-center">
            <Sparkles className="mr-1" size={18} />
            <span className="text-sm">Live</span>
          </div>
        </div>
      </div>
      
      {/* Podium */}
      <div className="p-4 flex justify-center items-end h-48">
        {/* 2nd place */}
        <div className="w-24 bg-blue-400 rounded-t-lg h-32 flex flex-col items-center justify-end p-2 mx-1">
          <Medal className="text-blue-800 mb-1" size={20} />
          <span className="text-white font-bold text-lg">2</span>
          <div className="bg-white rounded p-1 w-full text-center mt-2">
            <p className="font-semibold text-blue-800 text-sm truncate">Sam Wilson</p>
            <p className="text-blue-600 font-bold">8,720</p>
          </div>
        </div>
        
        {/* 1st place */}
        <div className="w-28 bg-blue-500 rounded-t-lg h-40 flex flex-col items-center justify-end p-2 mx-1">
          <Trophy className="text-yellow-400 mb-1" size={24} />
          <span className="text-white font-bold text-xl">1</span>
          <div className="bg-white rounded p-1 w-full text-center mt-2">
            <p className="font-semibold text-blue-800 text-sm truncate">Alex Johnson</p>
            <p className="text-blue-600 font-bold">9,850</p>
          </div>
        </div>
        
        {/* 3rd place */}
        <div className="w-24 bg-blue-300 rounded-t-lg h-24 flex flex-col items-center justify-end p-2 mx-1">
          <Medal className="text-blue-700 mb-1" size={20} />
          <span className="text-white font-bold text-lg">3</span>
          <div className="bg-white rounded p-1 w-full text-center mt-2">
            <p className="font-semibold text-blue-800 text-sm truncate">Taylor Swift</p>
            <p className="text-blue-600 font-bold">8,450</p>
          </div>
        </div>
      </div>
      
      {/* Competitors list */}
      <div className="p-4">
        <ul className="divide-y divide-gray-200">
          {topCompetitors.map((competitor, index) => (
            <li key={competitor.id} className="py-3 flex items-center">
              <span className={`font-bold w-6 text-center ${index === 0 ? 'text-blue-600' : 'text-gray-500'}`}>
                {index + 1}
              </span>
              <div className="ml-3 flex-1">
                <p className="font-medium text-gray-900">{competitor.name}</p>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-blue-600 mr-2">{competitor.score.toLocaleString()}</span>
                {competitor.change === 'up' ? (
                  <ChevronUp className="text-green-500" size={18} />
                ) : (
                  <ChevronDown className="text-red-500" size={18} />
                )}
              </div>
            </li>
          ))}
          
          {showAll && otherCompetitors.map((competitor, index) => (
            <li key={competitor.id} className="py-3 flex items-center">
              <span className="font-bold w-6 text-center text-gray-500">{index + 4}</span>
              <div className="ml-3 flex-1">
                <p className="font-medium text-gray-900">{competitor.name}</p>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-blue-600 mr-2">{competitor.score.toLocaleString()}</span>
                {competitor.change === 'up' ? (
                  <ChevronUp className="text-green-500" size={18} />
                ) : competitor.change === 'down' ? (
                  <ChevronDown className="text-red-500" size={18} />
                ) : (
                  <Sparkles className="text-yellow-500" size={18} />
                )}
              </div>
            </li>
          ))}
        </ul>
        
        <button 
          onClick={() => setShowAll(!showAll)}
          className="mt-4 w-full py-2 bg-blue-50 text-blue-600 rounded-lg font-medium flex items-center justify-center hover:bg-blue-100 transition"
        >
          {showAll ? 'Show less' : 'See more competitors'}
          {showAll ? (
            <ChevronUp className="ml-2" size={18} />
          ) : (
            <ChevronDown className="ml-2" size={18} />
          )}
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;