import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://she-can-backend-iz2g.vercel.app/api/leaderboard")
      .then(res => {
        let leaderboardData = [...res.data];
        
        // Check if there's a custom name from signup
        const storedName = localStorage.getItem('userName');
        if (storedName) {
          // Find if user already exists in leaderboard (by name "Youssef")
          const existingUserIndex = leaderboardData.findIndex(leader => 
            leader.name.toLowerCase() === 'youssef' || leader.name.toLowerCase() === 'youssef elkoumi'
          );
          
          if (existingUserIndex !== -1) {
            // Update existing entry with new name
            leaderboardData[existingUserIndex] = {
              ...leaderboardData[existingUserIndex],
              name: storedName
            };
          } else {
            // Add new user to leaderboard (this shouldn't happen with current data structure)
            leaderboardData.push({
              name: storedName,
              donations: 4200 // Default donation amount
            });
          }
          
          // Re-sort leaderboard by donations (descending)
          leaderboardData.sort((a, b) => b.donations - a.donations);
        }
        
        setLeaders(leaderboardData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getRankIcon = (index) => {
    switch(index) {
      case 0: return "🥇";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return "🏅";
    }
  };

  const getRankColor = (index) => {
    switch(index) {
      case 0: return "from-yellow-400 to-yellow-600";
      case 1: return "from-gray-400 to-gray-600";
      case 2: return "from-orange-400 to-orange-600";
      default: return "from-purple-400 to-purple-600";
    }
  };

  const getCardStyle = (index) => {
    switch(index) {
      case 0: return "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-yellow-100";
      case 1: return "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 shadow-gray-100";
      case 2: return "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-orange-100";
      default: return "bg-white border-purple-100 shadow-purple-50";
    }
  };

  // Check if current user is in leaderboard
  const storedName = localStorage.getItem('userName');
  const isCurrentUser = (leaderName) => {
    if (!storedName) return leaderName.toLowerCase() === 'youssef' || leaderName.toLowerCase() === 'youssef elkoumi';
    return leaderName.toLowerCase() === storedName.toLowerCase();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <div className="animate-spin w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"></div>
          <div className="text-gray-700 text-lg font-medium">Loading leaderboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </Link>
          
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            <h1 className="text-5xl font-bold mb-2">🏆 Leaderboard</h1>
          </div>
          <p className="text-gray-600 text-lg">Top performing fundraising interns</p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {leaders.slice(0, 3).map((leader, index) => {
            return (
              <div 
                key={index}
                className={`${getCardStyle(index)} p-6 rounded-3xl shadow-xl border-2 transform transition-all duration-300 hover:scale-105 ${
                  index === 0 ? 'md:order-2 scale-105' : index === 1 ? 'md:order-1' : 'md:order-3'
                } ${isCurrentUser(leader.name) ? 'ring-4 ring-purple-300 ring-opacity-50' : ''}`}
              >
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${getRankColor(index)} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                    {getRankIcon(index)}
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-2 ${isCurrentUser(leader.name) ? 'text-purple-700' : 'text-gray-800'}`}>
                    {leader.name}
                    {isCurrentUser(leader.name) && <span className="text-purple-500 ml-2">👤</span>}
                  </h3>
                  
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-green-600">
                      ₹{leader.donations.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getRankColor(index)} text-white text-sm font-medium`}>
                    <span>#{index + 1} Place</span>
                  </div>

                  {index === 0 && (
                    <div className="mt-4 flex justify-center">
                      <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
                        👑 CHAMPION
                      </div>
                    </div>
                  )}

                  {isCurrentUser(leader.name) && (
                    <div className="mt-2 flex justify-center">
                      <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                        🌟 YOU
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Full Leaderboard */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Complete Rankings
            </h2>
            <p className="text-purple-100 mt-1">All fundraising champions</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-3">
              {leaders.map((leader, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] ${
                    index < 3 ? getCardStyle(index) + ' border-2' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  } ${isCurrentUser(leader.name) ? 'ring-2 ring-purple-300 bg-purple-50' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${
                      index < 3 ? `bg-gradient-to-r ${getRankColor(index)}` : 'bg-gradient-to-r from-gray-400 to-gray-500'
                    }`}>
                      {index < 3 ? getRankIcon(index) : index + 1}
                    </div>
                    
                    <div>
                      <h4 className={`font-bold text-lg flex items-center gap-2 ${
                        isCurrentUser(leader.name) ? 'text-purple-700' : 'text-gray-800'
                      }`}>
                        {leader.name}
                        {isCurrentUser(leader.name) && (
                          <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-semibold">
                            YOU
                          </span>
                        )}
                      </h4>
                      <p className="text-gray-500 text-sm">Fundraising Intern</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      ₹{leader.donations.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Total Raised
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {leaders.length}
            </div>
            <p className="text-gray-600">Total Participants</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              ₹{leaders.reduce((sum, leader) => sum + leader.donations, 0).toLocaleString()}
            </div>
            <p className="text-gray-600">Total Raised</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              ₹{Math.round(leaders.reduce((sum, leader) => sum + leader.donations, 0) / leaders.length).toLocaleString()}
            </div>
            <p className="text-gray-600">Average per Intern</p>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
