import { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';

const TrustScore = () => {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    transactionService.getTrustScore()
      .then(data => setScore(data.trustScore))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse h-16 bg-gray-200 rounded"></div>;

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Highly Trusted';
    if (score >= 60) return 'Moderate';
    return 'High Risk';
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Your Trust Score</h3>
      <div className="flex items-baseline space-x-2">
        <span className={`text-3xl font-bold ${getScoreColor()}`}>{score}</span>
        <span className="text-gray-500">/ 100</span>
        <span className={`ml-2 px-2 py-1 text-sm rounded ${getScoreColor()} bg-gray-100`}>
          {getScoreLabel()}
        </span>
      </div>
      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${score}%` }}></div>
      </div>
    </div>
  );
};

export default TrustScore;