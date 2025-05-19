import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";


const MeetingsSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-4 sm:py-6">
      {/* Tabs Skeleton */}
      <div className="mb-6">
        <div className="grid w-full grid-cols-2 gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="min-h-[500px] sm:min-h-[600px]">
        {/* Meetings Tab Content */}
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <Skeleton className="h-10 w-40" />
          </div>

          {/* Meeting Cards */}
          <div className="grid gap-6">
            {[1, 2, 3].map((index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-3 sm:p-4">
                    <div className="mb-2">
                      <Skeleton className="h-5 w-24" />
                    </div>
                    <Skeleton className="mb-1 h-6 w-3/4" />
                    <Skeleton className="mb-2 h-4 w-1/2" />
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Skeleton className="mr-2 h-5 w-5 rounded-full" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="flex items-center">
                        <Skeleton className="mr-2 h-5 w-5 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                    <Skeleton className="mt-2 h-4 w-40" />
                  </div>
                  <div className="border-t border-gray-100 px-3 py-2 sm:px-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Skeleton className="mr-2 h-5 w-5 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-8 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingsSkeleton;
