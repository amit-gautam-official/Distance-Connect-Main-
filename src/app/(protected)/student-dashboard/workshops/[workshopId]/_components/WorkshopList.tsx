"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { Calendar, Clock, ExternalLink, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

type Workshop = {
  id: string;
  name: string;
  description: string;
  numberOfDays: number;
  schedule: { day: string; time: string }[];
  price: number;
  learningOutcomes: string[];
  courseDetails: Record<string, any>;
  otherDetails: string | null;
  meetUrl: string | null;
  meetLinks?: Record<string, any> | null;
  createdAt: Date;
  bannerImage: string | null;
  mentor: {
    mentorName: string;
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
}

export default function WorkshopList({ 
  workshops, 
  isLoading, 
  isEnrolled,
  onEnrollmentSuccess 
}: WorkshopListProps) {
  const router = useRouter();
  const [workshopToEnroll, setWorkshopToEnroll] = useState<string | null>(null);
  
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
          paymentStatus: true // In a real app, this would be set after payment confirmation
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
        <p className="mt-1 text-sm text-gray-500">
          {isEnrolled 
            ? "Explore available workshops to enhance your skills" 
            : "Check back later for new workshop opportunities"}
        </p>
        {isEnrolled && (
          <Button 
            onClick={() => router.push("/student-dashboard/workshops")} 
            className="mt-4"
          >
            Explore Workshops
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workshops.map((workshop) => (
          <Card key={workshop.id} className="group hover:shadow-md transition-all overflow-hidden">
            {workshop.bannerImage ? (
              <div className="relative h-48 w-full">
                <img
                  src={workshop.bannerImage}
                  alt={workshop.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <CardHeader className="absolute bottom-0 left-0 right-0 text-white">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-white/20">
                      <AvatarImage src={workshop.mentor.user.image || undefined} />
                      <AvatarFallback>{workshop.mentor.user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl font-bold text-white">{workshop.name}</CardTitle>
                      <p className="text-sm text-gray-200">
                        by {workshop.mentor.mentorName || workshop.mentor.user.name}
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </div>
            ) : (
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-primary/10">
                    <AvatarImage src={workshop.mentor.user.image || undefined} />
                    <AvatarFallback>{workshop.mentor.user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                      {workshop.name}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      by <span className="font-medium">{workshop.mentor.user.name}</span>
                    </p>
                  </div>
                </div>
              </CardHeader>
            )}
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage 
                    src={workshop.mentor.user.image || ""} 
                    alt={workshop.mentor.mentorName || workshop.mentor.user.name || ""}
                  />
                  <AvatarFallback>
                    {(workshop.mentor.mentorName || workshop.mentor.user.name || "M").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {workshop.mentor.mentorName || workshop.mentor.user.name || "Mentor"}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-2">
                {workshop.description}
              </p>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors">
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  {workshop.schedule.map(s => `${s.day}`).join(", ")}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors">
                <Clock className="h-4 w-4 text-primary" />
                <span>
                  {workshop.schedule.map(s => `${s.time}`).join(", ")}
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
              {isEnrolled ? (
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
                  ) : workshop.meetUrl ? (
                    <Button
                      variant="default"
                    className="w-full sm:w-auto transition-all"
                      size="sm"
                      onClick={() => window.open(workshop.meetUrl!, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Join Meeting
                    </Button>
                  ) : null}
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
      <AlertDialog open={!!workshopToEnroll} onOpenChange={() => setWorkshopToEnroll(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Enrollment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to enroll in this workshop? 
              {/* In a real app, this would include payment details */}
              This will give you access to the workshop materials and meeting links.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEnroll}
              disabled={enrollInWorkshop.isPending}
            >
              {enrollInWorkshop.isPending ? "Processing..." : "Confirm Enrollment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}