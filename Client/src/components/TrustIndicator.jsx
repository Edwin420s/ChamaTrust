import React from 'react';

const TrustIndicator = ({ score, showLabel = true, size = 'md' }) => {
  const getTrustLevel = (score) => {
    if (score >= 90) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 75) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 60) return { level: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (score >= 40) return { level: 'Poor', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { level: 'Very Poor', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const trustInfo = getTrustLevel(score);
  const percentage = Math.min(score, 100);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <svg className={`${sizeClasses[size]} transform -rotate-90`} viewBox="0 0 36 36">
          <path
            className="text-gray-200"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={trustInfo.color}
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${textSizes[size]} font-bold ${trustInfo.color}`}>
            {score}
          </span>
        </div>
      </div>
      
      {showLabel && (
        <div>
          <div className={`font-medium ${trustInfo.color}`}>
            {trustInfo.level}
          </div>
          <div className="text-xs text-gray-500">
            Trust Score
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustIndicator;
