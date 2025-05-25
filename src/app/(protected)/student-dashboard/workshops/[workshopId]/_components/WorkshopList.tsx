"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { Calendar, Clock, ExternalLink, Users } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { JSONValue } from "node_modules/superjson/dist/types";

type Workshop = {
  id: string;
  name: string;
  description: string;
  numberOfDays: number;
  schedule: any[];
  price: number;
  learningOutcomes: string[];
  courseDetails: JSONValue;
  otherDetails: string | null;
  meetLinks?: JSONValue;
  createdAt: Date;
  bannerImage: string | null;
  introductoryVideoUrl: string | null;
  scheduleType: string;
  mentor: {
    mentorName: string | null;
    user: {
      name: string | null;  
      image: string | null;
    };
  };
  _count?: { enrollments: number };
};

interface WorkshopListProps {
  workshops: Workshop[];
  isLoading: boolean;
  isEnrolled: boolean;
  onEnrollmentSuccess?: () => void;
  enrolledWorkshopIds?: string[];
}

export default function WorkshopList({ 
  workshops, 
  isLoading, 
  isEnrolled,
  onEnrollmentSuccess,
  enrolledWorkshopIds = []
}: WorkshopListProps) {
  const router = useRouter();
  const [workshopToEnroll, setWorkshopToEnroll] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({}); 
  const [studentGmailId, setStudentGmailId] = useState<string>("");
  const MAX_DESC_LENGTH = 120; // Maximum characters for description

  // console.log(workshops);
  const enrollInWorkshop = api.workshop.enrollInWorkshop.useMutation({
    onSuccess: () => {
      toast.success("Successfully enrolled in workshop!");
      setWorkshopToEnroll(null);
      onEnrollmentSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleEnroll = async () => {
    if (workshopToEnroll) {
      try {
        await enrollInWorkshop.mutateAsync({ 
          workshopId: workshopToEnroll,
          studentGmailId:studentGmailId,
        });
      } catch (error) {
        // Error handled in the mutation
      }
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-16 bg-gray-200 rounded-t-lg"></CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between p-4 border-t">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  // Empty state
  if (workshops.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-4 sm:p-8 text-center border rounded-lg bg-gray-50/80 backdrop-blur-sm shadow-sm mx-2 sm:mx-4">
        <h3 className="text-lg font-medium text-gray-900">
          {isEnrolled 
            ? "You haven't enrolled in any workshops yet" 
            : "No workshops available at the moment"}
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          {isEnrolled
            ? "Explore available workshops and start your learning journey!"
            : "Check back later for new and exciting workshops."}
        </p>
        {!isEnrolled && (
          <Button onClick={() => router.push('/student-dashboard/workshops')} className="mt-4">
            Explore All Workshops
          </Button>
        )}
      </div>
    );
  }

  // Format price to INR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price / 100); // Convert paise to rupees
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workshops.map((workshop) => (
          <Card key={workshop.id} className="overflow-hidden group rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white flex flex-col">
            {(workshop.bannerImage || workshop.introductoryVideoUrl) ? (
              <div
                className="relative h-48 w-full"
                onMouseEnter={() => {
                  if (workshop.introductoryVideoUrl && videoRefs.current[workshop.id]) {
                    videoRefs.current[workshop.id]?.play().catch(error => console.warn("Video play failed:", error));
                  }
                }}
                onMouseLeave={() => {
                  if (workshop.introductoryVideoUrl && videoRefs.current[workshop.id]) {
                    videoRefs.current[workshop.id]?.pause();
                    if (videoRefs.current[workshop.id]) { // Check again before setting currentTime
                        videoRefs.current[workshop.id]!.currentTime = 0;
                    }
                  }
                }}
              >
                {workshop.bannerImage && (
                  <img
                    src={workshop.bannerImage}
                    alt={workshop.name}
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ${workshop.introductoryVideoUrl ? 'group-hover:opacity-0' : 'opacity-100'}`}
                  />
                )}
                {workshop.introductoryVideoUrl && (
                  <video
                    ref={(el) => { if (videoRefs.current) videoRefs.current[workshop.id] = el; }}
                    src={workshop.introductoryVideoUrl}
                    className="absolute top-0 left-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    loop
                    muted
                    playsInline
                    poster={workshop.bannerImage ?? undefined}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
                {/* Fallback background if only video is present and not hovered */}
                {workshop.introductoryVideoUrl && !workshop.bannerImage && (
                   <div className="absolute top-0 left-0 w-full h-full bg-gray-200 group-hover:opacity-0 transition-opacity duration-300" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" />
                <CardHeader className="absolute bottom-0 left-0 right-0 text-white p-3 sm:p-4 z-20">
                  <CardTitle className="text-lg sm:text-xl font-bold">{workshop.name}</CardTitle>
                  {/* Mentor details can be added here if needed, similar to mentor's card */}
                  <Link href={`/mentor-dashboard/workshops/${workshop.id}`} className="text-sm text-gray-200 mt-1 hover:underline">
                    by {workshop.mentor.user.name}
                  </Link>
                </CardHeader>
              </div>
            ) : (
              // Fallback if no banner and no video, show gray background with overlay and title
              <div className="relative h-48 w-full bg-gradient-to-br from-gray-200 to-gray-300">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10" />
                <CardHeader className="absolute bottom-0 left-0 right-0 text-white p-3 sm:p-4 z-20">
                  <CardTitle className="text-lg sm:text-xl font-bold">{workshop.name}</CardTitle>
                  <Link href={`/mentor-dashboard/workshops/${workshop.id}`} className="text-sm text-gray-200 mt-1 hover:underline">
                    by {workshop.mentor.user.name}
                  </Link>
                </CardHeader>
              </div>
            )}

            {/* Original CardHeader and CardContent structure for details below banner */}
            {/* This CardHeader is for details like mentor avatar if not in banner */}
            {/* <CardHeader className="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white"> */}
            {/* We need to decide if the mentor avatar and name go into the banner's CardHeader or a separate one below */}
            {/* For now, I've added mentor name to the banner's CardHeader. If a separate section is needed, adjust here. */}
            {/* </CardHeader> */}

            <CardContent className="p-4 space-y-3 flex-grow">
              {/* Description - ensuring it's not redundant if shown in banner */}
              <p className="text-sm text-gray-600">
                {workshop.description.length > MAX_DESC_LENGTH 
                  ? `${workshop.description.substring(0, MAX_DESC_LENGTH)}...` 
                  : workshop.description}
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  {
                    workshop.scheduleType === "recurring" ? 
                    (workshop.schedule as { day: string; time: string }[]).map(s => `${s.day}`).join(", ") :
                    (workshop.schedule[0] as { date: string; time: string }).date ? `${new Date((workshop.schedule[0] as { date: string; time: string }).date).toLocaleDateString()}` : ""
                  } 
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4 text-primary" />
                <span>
                  {(workshop.schedule as { day: string; time: string }[] | { date: string; time: string }[]).map(s => `${s.time}`).join(", ")}
                </span>
              </div>
              
              {workshop._count && (
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  <span>
                    {workshop._count.enrollments} student{workshop._count.enrollments !== 1 ? "s" : ""} enrolled
                  </span>
                </div>
              )}
              
              <div className="mt-3 text-lg font-bold text-primary bg-primary/5 inline-block px-3 py-1 rounded-full">
                {formatPrice(workshop.price)}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between p-3 sm:p-4 border-t bg-gradient-to-r from-gray-50 to-white">
              {isEnrolled || enrolledWorkshopIds.includes(workshop.id) ? (
                <>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto transition-all hover:bg-primary/5"
                    size="sm"
                    onClick={() => router.push(`/student-dashboard/workshops/${workshop.id}`)}
                  >
                    View Details
                  </Button>
                  {workshop.meetLinks && Object.keys(workshop.meetLinks as Record<string, any>).length > 0 ? (
                    <Button
                      variant="default"
                    className="w-full sm:w-auto transition-all"
                      size="sm"
                      onClick={() => router.push(`/student-dashboard/workshops/${workshop.id}`)}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Sessions
                    </Button>
                  ) : (
                    <>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto transition-all hover:bg-primary/5"
                    size="sm"
                    onClick={() => router.push(`/student-dashboard/workshops/${workshop.id}`)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="default"
                    className="w-full sm:w-auto transition-all"
                    size="sm"
                    onClick={() => setWorkshopToEnroll(workshop.id)}
                  >
                    Enroll Now
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Enrollment confirmation dialog */}
     
<Dialog open={!!workshopToEnroll} onOpenChange={() => setWorkshopToEnroll(null)}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Enrollment</DialogTitle>
      <DialogDescription>
        Are you sure you want to enroll in &quot;{workshopToEnroll}&quot;?
        <br />
        This will give you access to the workshop materials and meeting links.
      </DialogDescription>
    </DialogHeader>

    <div className="py-2">
      <Input
        type="email"
        placeholder="Enter your email (GMAIL) for Google Meet"
        value={studentGmailId}
        onChange={(e) => setStudentGmailId(e.target.value)}
      />
    </div>

    <DialogFooter>
      <Button variant="outline" onClick={() => setWorkshopToEnroll(null)}>
        Cancel
      </Button>
      <Button
        onClick={handleEnroll}
        disabled={enrollInWorkshop.isPending}
      >
        {enrollInWorkshop.isPending ? "Processing..." : "Confirm Enrollment"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </>
  );
}