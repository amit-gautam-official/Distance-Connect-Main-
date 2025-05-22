"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { ArrowLeft, Calendar, Clock, ExternalLink, Users, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from 'next/navigation'
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

export default function WorkshopDetailPage() {
  const router = useRouter();
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);

  // Unwrap params using React.use()
  const params = useParams<{ workshopId: string }>();
  const workshopId = params.workshopId;

  // Fetch workshop details
  const {
    data: workshop,
    isLoading,
  } = api.workshop.getWorkshopById.useQuery(
    { id: workshopId },
    {
      enabled: !!workshopId,
      retry: 1,
    }
  );

  // Check if student is enrolled
  const { data: enrolledWorkshops, isLoading: isLoadingEnrolled, refetch: refetchEnrolled } = 
    api.workshop.getEnrolledWorkshops.useQuery();
  
  const isEnrolled = enrolledWorkshops?.some(
    (enrollment) => enrollment.workshop.id === workshopId
  );

  // Enroll in workshop mutation
  const enrollInWorkshop = api.workshop.enrollInWorkshop.useMutation({
    onSuccess: () => {
      toast.success("Successfully enrolled in workshop!");
      setIsEnrollDialogOpen(false);
      void refetchEnrolled();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleEnroll = async () => {
    try {
      await enrollInWorkshop.mutateAsync({ 
        workshopId: params.workshopId,
        paymentStatus: true // In a real app, this would be set after payment confirmation
      });
    } catch (error) {
      // Error handled in the mutation
    }
  };

  // Format price to INR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price / 100); // Convert paise to rupees
  };

  // Loading state
  if (isLoading || isLoadingEnrolled) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Skeleton className="h-64 w-full" />
          </div>
          <div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Workshop not found
  if (!workshop) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Workshop not found</h2>
          <p className="mt-2 text-gray-600">
            The workshop you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button onClick={() => router.push("/student-dashboard/workshops")} className="mt-4">
            Back to Workshops
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/student-dashboard/workshops")}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">{workshop.name}</h1>
        {isEnrolled && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Enrolled
          </Badge>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Workshop Information</CardTitle>
              <CardDescription>
                {workshop.numberOfDays} day{workshop.numberOfDays > 1 ? "s" : ""} workshop by{" "}
                <span className="font-medium">
                  {workshop.mentor.mentorName || workshop.mentor.user.name || "Mentor"}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={workshop.mentor.user.image || ""}
                    alt={workshop.mentor.mentorName || workshop.mentor.user.name || ""}
                  />
                  <AvatarFallback>
                    {(workshop.mentor.mentorName || workshop.mentor.user.name || "M")
                      .charAt(0)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">
                    {workshop.mentor.mentorName || workshop.mentor.user.name || "Mentor"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {workshop.mentor.currentCompany && workshop.mentor.jobTitle
                      ? `${workshop.mentor.jobTitle} at ${workshop.mentor.currentCompany}`
                      : "Workshop Instructor"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Description</h3>
                <p className="mt-2 text-gray-700">{workshop.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium">Schedule</h3>
                <div className="mt-2 space-y-2">
                  {workshop.schedule.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span>
                        {item.day} at {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Learning Outcomes</h3>
                <ul className="mt-2 list-disc list-inside space-y-1 text-gray-700">
                  {workshop.learningOutcomes.map((outcome: string, index: number) => (
                    <li key={index}>{outcome}</li>
                  ))}
                </ul>
              </div>

              {workshop.courseDetails && (
                <div>
                  <h3 className="text-lg font-medium">Course Details</h3>
                  <div className="mt-2 space-y-4">
                    {Object.entries(workshop.courseDetails).map(([day, content]) => (
                      <div key={day} className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium text-gray-900">{day}</h4>
                        <p className="mt-1 text-gray-700">{content as string}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {workshop.otherDetails && (
                <div>
                  <h3 className="text-lg font-medium">Additional Information</h3>
                  <p className="mt-2 text-gray-700">{workshop.otherDetails}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workshop Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Price</span>
                <div className="mt-4 text-lg font-bold text-primary bg-primary/5 inline-block px-3 py-1 rounded-full">
                  {formatPrice(workshop.price)}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Duration</span>
                <span>{workshop.numberOfDays} day{workshop.numberOfDays > 1 ? "s" : ""}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Created</span>
                <span>{new Date(workshop.createdAt).toLocaleDateString()}</span>
              </div>

              {!isEnrolled ? (
                <Button 
                  className="w-full mt-4" 
                  onClick={() => setIsEnrollDialogOpen(true)}
                >
                  Enroll Now
                </Button>
              ) : workshop.meetLinks && Object.keys(workshop.meetLinks).length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors">
                    <Video className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="truncate text-sm">Meeting links available</div>
                  </div>
                  
                  {/* Display meeting links for each day */}
                  <div className="space-y-2">
                    {Object.entries(workshop.meetLinks as Record<string, any>).map(([key, value]) => {
                      const dayNumber = key.replace('day', '');
                      const scheduledDate = new Date(value.scheduledFor);
                      const formattedDate = scheduledDate.toLocaleDateString(undefined, {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });
                      
                      return (
                        <div key={key} className="border rounded-md p-2 sm:p-3 hover:border-primary/20 transition-colors">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Day {dayNumber}</span>
                            <span className="text-xs text-gray-500">{formattedDate}</span>
                          </div>
                          <Button 
                            className="w-full transition-all hover:shadow-md"
                            onClick={() => window.open(value.link, "_blank")}
                            size="sm"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Join Session {dayNumber}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50/80 backdrop-blur-sm text-amber-800 p-2 sm:p-3 rounded-md text-sm shadow-sm">
                  The meeting link will be available soon. Check back later.
                </div>
              )}
            </CardContent>
          </Card>

          {isEnrolled && (
            <Card className="transition-all duration-300 hover:shadow-md bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Your Enrollment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50/80 backdrop-blur-sm text-green-700 p-3 sm:p-4 rounded-md shadow-sm border border-green-100">
                  <p className="font-medium">You&apos;re enrolled in this workshop!</p>
                  <p className="mt-1 text-sm">
                    You&apos;ll receive updates and access to the workshop materials.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Enrollment confirmation dialog */}
      <AlertDialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Enrollment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to enroll in &quot;{workshop.name}&quot;?
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
    </div>
  );
}
