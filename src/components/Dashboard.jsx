import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/user")
      .then(res => {
        const userData = res.data;
        
        // Check if there's a custom name from signup
        const storedName = localStorage.getItem('userName');
        if (storedName) {
          userData.name = storedName;
          // Generate referral code based on the name
          userData.referralCode = storedName.toLowerCase().replace(/\s+/g, '') + "2025";
        }
        
        setUser(userData);
      })
      .catch(err => console.error(err));
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <div className="animate-spin w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"></div>
          <div className="text-gray-700 text-lg font-medium">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min((user.donations / 5000) * 100, 100);
  const nextMilestone = user.donations >= 5000 ? "🎉 All milestones achieved!" : 
                       user.donations >= 1000 ? "Next: ₹5000 for Premium Badge" :
                       user.donations >= 500 ? "Next: ₹1000 for Wall of Fame" :
                       user.donations >= 100 ? "Next: ₹500 for T-shirt" :
                       "Next: ₹100 for First Badge";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Intern Portal Dashboard
          </h1>
          <p className="text-gray-600">Track your fundraising journey</p>
        </div>

        {/* User Info Card */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50">
          <div className="flex items-center gap-6">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full p-6 shadow-lg">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome back, {user.name}! 🎉
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    🔗 {user.referralCode}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-green-600">₹{user.donations.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">raised</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress to Next Goal</span>
              <span className="text-sm text-gray-500">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{nextMilestone}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Rewards Card */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-2xl">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Your Rewards</h3>
            </div>
            
            <div className="space-y-4">
              {[
                { amount: 100, reward: "First Achievement Badge", icon: "🥇", unlocked: user.donations >= 100 },
                { amount: 500, reward: "Exclusive T-shirt", icon: "👕", unlocked: user.donations >= 500 },
                { amount: 1000, reward: "Wall of Fame Feature", icon: "🌟", unlocked: user.donations >= 1000 },
                { amount: 5000, reward: "Premium Badge", icon: "💎", unlocked: user.donations >= 5000 }
              ].map((item, index) => (
                <div key={index} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  item.unlocked 
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200' 
                    : 'bg-gray-50 border-2 border-gray-200'
                }`}>
                  <div className={`text-2xl ${item.unlocked ? 'grayscale-0' : 'grayscale'}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${
                        item.unlocked ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        ₹{item.amount.toLocaleString()}
                      </span>
                      {item.unlocked && <span className="text-green-600 text-sm">✓ UNLOCKED</span>}
                    </div>
                    <p className={`text-sm ${item.unlocked ? 'text-gray-700' : 'text-gray-500'}`}>
                      {item.reward}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Your Impact</h3>
            </div>
            
            <div className="space-y-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
                <div className="text-3xl font-bold text-purple-600 mb-1">
                  ₹{user.donations.toLocaleString()}
                </div>
                <p className="text-gray-600">Total Raised</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-xl font-bold text-green-600">
                    {user.donations >= 1000 ? '3+' : user.donations >= 100 ? '2+' : '1+'}
                  </div>
                  <p className="text-sm text-gray-600">Rewards Earned</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <div className="text-xl font-bold text-orange-600">#{user.donations >= 4000 ? '2' : '3'}</div>
                  <p className="text-sm text-gray-600">Leaderboard Rank</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            to="/leaderboard"
            className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            🏆 View Leaderboard
          </Link>
          
          <button 
            onClick={() => {
              localStorage.removeItem('userName');
              window.location.href = '/';
            }}
            className="bg-white/80 backdrop-blur-sm text-purple-600 px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-purple-200 hover:border-purple-300 flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1.414 1.414L10 12.828l8.414-8.414A1 1 0 0017 3H3z" clipRule="evenodd" />
            </svg>
            🚪 Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}