import React from 'react';
const chartHeights = [20, 30, 40, 20, 40, 40, 60, 30, 40, 30, 40, 50];
const bars = Array(12).fill(0);

export const MentorDashboardSkeleton: React.FC = () => {
  return (
    <div className="p-6 w-full max-w-7xl mx-auto animate-pulse">
      {/* Dashboard Title */}
      <div className="mb-8">
        <div className="h-10 w-36 bg-gray-200 rounded-md"></div>
      </div>

      {/* Progress Chart */}
      <div className="mb-10">
        <div className="h-6 w-48 bg-gray-200 rounded-md mb-4"></div>
        
        {/* Simple Bar Graph Skeleton */}
        <div className="h-64 w-full bg-gray-100 rounded-lg p-4">
          <div className="h-full w-full flex items-end justify-between">
            {bars.map((_, index) => {
              
              return (
                <div 
                  key={index} 
                  className="bg-gray-200 rounded-t-sm w-full mx-1"
                  style={{ height: `${chartHeights[index]}%` }}
                ></div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scheduled Sessions Section */}
      <div className="mb-6 flex justify-between items-center">
        <div className="h-6 w-48 bg-gray-200 rounded-md"></div>
        <div className="h-5 w-16 bg-gray-200 rounded-md"></div>
      </div>

      {/* Session Cards - Just 2 minimal cards */}
      {[1, 2].map((_, index) => (
        <div key={index} className="flex mb-4 border-t border-gray-100 pt-4">
          {/* Date */}
          <div className="mr-6 w-16">
            <div className="h-8 w-10 bg-gray-200 rounded-md mb-2"></div>
            <div className="h-5 w-12 bg-gray-200 rounded-md"></div>
          </div>

          {/* Session Details */}
          <div className="flex-1">
            <div className="h-6 w-40 bg-gray-200 rounded-md mb-2"></div>
            <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
          </div>

          {/* Join Button */}
          <div className="ml-4">
            <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ProgressChartSkeleton: React.FC = () => {
  return (
    <div className="mb-10">
        <div className="h-6 w-48 bg-gray-200 rounded-md mb-4"></div>
        
        {/* Simple Bar Graph Skeleton */}
        <div className="h-64 w-full bg-gray-100 rounded-lg p-4">
          <div className="h-full w-full flex items-end justify-between">
            {bars.map((_, index) => {
              
              return (
                <div 
                  key={index} 
                  className="bg-gray-200 rounded-t-sm w-full mx-1"
                  style={{ height: `${chartHeights[index]}%` }}
                ></div>
              );
            })}
          </div>
        </div>
      </div>
  );
}

export const ScheduledSessionsSkeleton: React.FC = () => {
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div className="h-6 w-48 bg-gray-200 rounded-md"></div>
        <div className="h-5 w-16 bg-gray-200 rounded-md"></div>
      </div>

      {/* Session Cards - Just 2 minimal cards */}
      {[1, 2].map((_, index) => (
        <div key={index} className="flex mb-4 border-t border-gray-100 pt-4">
          {/* Date */}
          <div className="mr-6 w-16">
            <div className="h-8 w-10 bg-gray-200 rounded-md mb-2"></div>
            <div className="h-5 w-12 bg-gray-200 rounded-md"></div>
          </div>

          {/* Session Details */}
          <div className="flex-1">
            <div className="h-6 w-40 bg-gray-200 rounded-md mb-2"></div>
            <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
          </div>

          {/* Join Button */}
          <div className="ml-4">
            <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  )
}