import { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';
import { getTrustScoreInfo } from '../utils/helpers';

const TrustScore = () => {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scoreHistory, setScoreHistory] = useState([75, 78, 82, 85, 83, 85]);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const data = await transactionService.getTrustScore();
        setScore(data.trustScore || 85);
      } catch (err) {
        console.error('Failed to fetch trust score:', err);
        setScore(85); // Fallback score
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div className="h-2 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  const scoreInfo = getTrustScoreInfo(score);
  const percentage = score;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Trust Score</h3>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-xs text-white font-medium">Updated Today</span>
          </div>
        </div>
      </div>

      {/* Score Display */}
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-8 border-gray-200"></div>
            <div 
              className="absolute inset-0 w-32 h-32 rounded-full border-8 border-transparent border-t-blue-600 border-r-blue-600 transform rotate-45"
              style={{ 
                borderRightColor: scoreInfo.color === 'green' ? '#10b981' : 
                               scoreInfo.color === 'blue' ? '#3b82f6' : 
                               scoreInfo.color === 'yellow' ? '#f59e0b' : 
                               scoreInfo.color === 'orange' ? '#f97316' : '#ef4444',
                transform: `rotate(${45 + (percentage * 1.8)}deg)`
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-3xl font-bold ${
                  scoreInfo.color === 'green' ? 'text-green-600' : 
                  scoreInfo.color === 'blue' ? 'text-blue-600' : 
                  scoreInfo.color === 'yellow' ? 'text-yellow-600' : 
                  scoreInfo.color === 'orange' ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {score}
                </div>
                <div className="text-xs text-gray-500">out of 100</div>
              </div>
            </div>
          </div>
        </div>

        {/* Score Label */}
        <div className="text-center mb-6">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            scoreInfo.color === 'green' ? 'bg-green-100 text-green-800' : 
            scoreInfo.color === 'blue' ? 'bg-blue-100 text-blue-800' : 
            scoreInfo.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 
            scoreInfo.color === 'orange' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
          }`}>
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {scoreInfo.label}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Trust Level</span>
            <span className="font-medium">{percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                scoreInfo.color === 'green' ? 'bg-green-500' : 
                scoreInfo.color === 'blue' ? 'bg-blue-500' : 
                scoreInfo.color === 'yellow' ? 'bg-yellow-500' : 
                scoreInfo.color === 'orange' ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Score Factors */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">Score Factors</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Payment History</span>
              <span className="text-green-600 font-medium">+40 pts</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Contributions</span>
              <span className="text-green-600 font-medium">+30 pts</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Participation</span>
              <span className="text-green-600 font-medium">+20 pts</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Penalties</span>
              <span className="text-red-600 font-medium">-5 pts</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
            View Detailed Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrustScore;