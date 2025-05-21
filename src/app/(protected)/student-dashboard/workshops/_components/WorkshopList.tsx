"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-gray-50">
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
          <Card key={workshop.id} className="overflow-hidden">
            <CardHeader className="bg-primary/5 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                    {workshop.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {workshop.numberOfDays} day{workshop.numberOfDays > 1 ? "s" : ""} workshop
                  </p>
                </div>
                {isEnrolled && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Enrolled
                  </Badge>
                )}
              </div>
            </CardHeader>
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
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  {workshop.schedule.map(s => `${s.day}`).join(", ")}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
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
              
              <div className="mt-2 text-lg font-bold text-primary">
                {formatPrice(workshop.price)}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between p-4 border-t bg-gray-50">
              {isEnrolled ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/student-dashboard/workshops/${workshop.id}`)}
                  >
                    View Details
                  </Button>
                  {workshop.meetLinks && Object.keys(workshop.meetLinks as Record<string, any>).length > 0 ? (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => router.push(`/student-dashboard/workshops/${workshop.id}`)}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Sessions
                    </Button>
                  ) : workshop.meetUrl ? (
                    <Button
                      variant="default"
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
                    size="sm"
                    onClick={() => router.push(`/student-dashboard/workshops/${workshop.id}`)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="default"
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
