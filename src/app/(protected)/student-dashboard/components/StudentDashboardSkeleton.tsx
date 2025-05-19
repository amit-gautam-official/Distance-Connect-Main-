export default function StudentDashboardSkeleton() {
    return (
      <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
        {/* Header Card Skeleton */}
        <div className="bg-blue-500 rounded-lg mb-3 sm:mb-4 p-4 sm:p-6 text-white shadow-md animate-pulse">
          <div className="h-3 sm:h-4 w-12 sm:w-16 bg-blue-400 rounded mb-1 sm:mb-2"></div>
          <div className="flex justify-between items-center">
            <div className="h-6 sm:h-8 bg-blue-400 rounded w-4/5 sm:w-3/4"></div>
            <div className="hidden md:block h-8 sm:h-10 w-24 sm:w-28 bg-blue-400 rounded-lg"></div>
          </div>
          <div className="md:hidden mt-3 sm:mt-4">
            <div className="h-8 sm:h-10 w-full bg-blue-400 rounded-lg"></div>
          </div>
        </div>
  
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
          {/* Sessions Completed Skeleton */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm animate-pulse">
            <div className="flex justify-between items-start">
              <div className="w-full">
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 mb-2 sm:mb-3"></div>
                <div className="h-8 sm:h-10 bg-gray-200 rounded w-1/4 mb-1 sm:mb-2"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/5"></div>
              </div>
              <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-200 rounded-full"></div>
              </div>
            </div>
          </div>
  
          {/* Total Time Spent Skeleton */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm animate-pulse">
            <div className="flex justify-between items-start">
              <div className="w-full">
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 mb-2 sm:mb-3"></div>
                <div className="h-8 sm:h-10 bg-gray-200 rounded w-1/3 mb-1 sm:mb-2"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/5"></div>
              </div>
              <div className="bg-red-100 p-2 sm:p-3 rounded-full">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-200 rounded-full"></div>
              </div>
            </div>
          </div>
  
          {/* Total Pending Skeleton */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm animate-pulse">
            <div className="flex justify-between items-start">
              <div className="w-full">
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 mb-2 sm:mb-3"></div>
                <div className="h-8 sm:h-10 bg-gray-200 rounded w-1/4 mb-1 sm:mb-2"></div>
              </div>
              <div className="bg-orange-100 p-2 sm:p-3 rounded-full">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Bottom Section Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Track Sessions Graph Skeleton */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm animate-pulse">
            <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/3 mb-3 sm:mb-4"></div>
            <div className="h-40 sm:h-64 bg-gray-100 rounded"></div>
          </div>
  
          {/* Upcoming Meetings Skeleton */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm animate-pulse">
            <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/3 mb-3 sm:mb-4"></div>
            <div className="flex flex-col items-center justify-center h-40 sm:h-64">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full mb-3 sm:mb-4"></div>
              <div className="h-5 sm:h-6 bg-gray-200 rounded w-2/3 mb-2 sm:mb-3"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-1 sm:mb-2"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3 mb-4 sm:mb-6"></div>
              <div className="h-8 sm:h-10 bg-gray-200 rounded w-28 sm:w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }