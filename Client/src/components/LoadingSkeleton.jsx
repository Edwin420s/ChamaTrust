import React from 'react';

const LoadingSkeleton = ({ className = "", lines = 3 }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-gray-200 rounded animate-pulse"
          style={{ 
            width: index === lines - 1 ? '60%' : '100%',
            animationDelay: `${index * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};

export const CardSkeleton = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <div className="animate-pulse">
      <div className="h-12 bg-gray-200 border-b"></div>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-16 bg-gray-200 border-b"></div>
      ))}
    </div>
  </div>
);

export default LoadingSkeleton;
