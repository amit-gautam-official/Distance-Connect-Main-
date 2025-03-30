import React from "react";

const LoadingSkeleton = () => {
  return (
    <div className="h-screen w-full bg-gray-50">
      <div className="container mx-auto h-full px-0">
        <div className="flex h-full">
          {/* Chat List Skeleton */}
          <div className="w-80 border-r border-gray-200 bg-white">
            <div className="p-4">
              <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
            </div>
            <div className="space-y-3 p-4">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 rounded-lg p-3 hover:bg-gray-50"
                >
                  <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area Skeleton */}
          <div className="flex-1">
            <div className="flex h-full flex-col">
              {/* Chat Header */}
              <div className="border-b border-gray-200 bg-white p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      index % 2 === 0 ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        index % 2 === 0 ? "bg-white" : "bg-blue-50"
                      }`}
                    >
                      <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                      <div className="mt-2 h-3 w-32 animate-pulse rounded bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 bg-white p-4">
                <div className="flex items-center space-x-2">
                  <div className="h-10 flex-1 animate-pulse rounded-lg bg-gray-200" />
                  <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
