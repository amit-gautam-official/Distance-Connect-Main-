import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const ProfileSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-4 sm:py-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 lg:gap-8">
        {/* Profile Header Skeleton - Takes full width on mobile, 1/3 on desktop */}
        <div className="col-span-1 md:sticky md:top-20 md:self-start">
          <div className="rounded-lg border bg-card p-4 shadow-sm sm:p-6">
            <div className="flex flex-col items-center space-y-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2 text-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-20" />
                ))}
              </div>
              <div className="w-full space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Skeleton - Takes full width on mobile, 2/3 on desktop */}
        <div className="col-span-1 space-y-4 md:col-span-2 md:space-y-6">
          <div className="min-h-[500px] sm:min-h-[600px]">
            <Card className="p-6">
              <div className="space-y-6">
                {/* Tabs Skeleton */}
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-10 w-24" />
                  ))}
                </div>

                {/* Content Skeleton */}
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
