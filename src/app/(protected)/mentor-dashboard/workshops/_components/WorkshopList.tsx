"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/trpc/react";
import { Calendar, Clock, Edit, Eye, Share2, Trash, Users } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
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
import { useRouter } from "next/navigation";
import EditWorkshopModal from "./EditWorkshopModal";
import { JsonValue } from "@prisma/client/runtime/library";

// Define the structure of a schedule item
type ScheduleItem = {
  day: string;
  time: string;
  [key: string]: any; // Allow for other properties
};



interface WorkshopListProps {
  workshops: any[];
  isLoading: boolean;
  onRefresh: () => void;
}

export default function WorkshopList({
  workshops,
  isLoading,
  onRefresh,
}: WorkshopListProps) {
  const router = useRouter();
  const [workshopToDelete, setWorkshopToDelete] = useState<string | null>(null);
  const [workshopToEdit, setWorkshopToEdit] = useState<any>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const MAX_DESC_LENGTH = 150; // Maximum characters for description

  const deleteWorkshop = api.workshop.deleteWorkshop.useMutation({
    onSuccess: () => {
      toast.success("Workshop deleted successfully");
      onRefresh();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleDelete = async () => {
    if (workshopToDelete) {
      await deleteWorkshop.mutateAsync({ id: workshopToDelete });
      setWorkshopToDelete(null);
    }
  };

  const handleEditSuccess = () => {
    setWorkshopToEdit(null);
    onRefresh();
    toast.success("Workshop updated successfully");
  };

  
const getWorkshopStatus = (workshop: any): "upcoming" | "ongoing" | "passed" => {
  let startDate: Date | null = null;
  if (workshop.scheduleType === "custom" && !workshop.startDate) {
    if (workshop.schedule.length === 0) {
      throw new Error("Custom schedule is empty.");
    }
    // Use the first date from schedule for custom type
    startDate = new Date(workshop.schedule[0].date);
  } else if (workshop.startDate) {
    startDate = new Date(workshop.startDate);
  }

  if (!startDate || isNaN(startDate.getTime())) {
    throw new Error("Invalid or missing start date.");
  }

  // Set time to 00:00:00 for date-only comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + workshop.numberOfDays - 1);

  if (today < start) return "upcoming";
  if (today >= start && today <= end) return "ongoing";
  return "passed";
};



  // Function to render status tag
  const renderStatusTag = (workshop: any) => {
    const status = getWorkshopStatus(workshop);
    
    
    const tagConfig = {
      ongoing: {
        text: "Ongoing",
        className: "bg-blue-100 text-blue-800 border-green-200"
      },
      passed: {
        text: "Passed",
        className: "bg-gray-100 text-gray-600 border-gray-200"
      },
      upcoming: {
        text: "Upcoming",
        className: " bg-green-100 text-green-800 border-blue-200"
      }

    };

    const config = tagConfig[status as keyof typeof tagConfig];
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.className}`}>
        {config.text}
      </span>
    );
  };

  // Handle share workshop link
  const handleShare = (workshopId: string, workshopName: string) => {
    // Get the base URL from the window location
    // In production, you might want to use an environment variable for the domain
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/workshops/${workshopId}`;

    // Copy to clipboard
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast.success(
          `Workshop link for "${workshopName}" copied to clipboard`,
        );
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
        toast.error("Failed to copy link. Please try again.");
      });
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workshops.map((workshop) => (
          <Card key={workshop.id} className="animate-pulse">
            {workshop.bannerImage ? (
              <div className="relative h-48 w-full">
                <img
                  src={workshop.bannerImage}
                  alt={workshop.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <CardHeader className="absolute bottom-0 left-0 right-0 text-white">
                  <CardTitle className="text-xl font-bold">
                    {workshop.name}
                  </CardTitle>
                </CardHeader>
              </div>
            ) : (
              <CardHeader>
                <CardTitle>{workshop.name}</CardTitle>
              </CardHeader>
            )}
            <CardContent className="space-y-3 p-3 sm:p-4">
              <div className="h-6 w-3/4 rounded bg-gray-200"></div>
              <div className="h-4 w-full rounded bg-gray-200"></div>
              <div className="h-4 w-5/6 rounded bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-gray-200"></div>
                <div className="h-4 w-1/4 rounded bg-gray-200"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-gray-200"></div>
                <div className="h-4 w-1/3 rounded bg-gray-200"></div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-3 sm:p-4">
              <div className="h-8 w-1/3 rounded bg-gray-200"></div>
              <div className="flex gap-2">
                <div className="h-8 w-8 rounded bg-gray-200"></div>
                <div className="h-8 w-8 rounded bg-gray-200"></div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  // Format price to INR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workshops.map((workshop) => (
          <Card
            key={workshop.id}
            className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            {workshop.bannerImage || workshop.introductoryVideoUrl ? (
              <div
                className="relative h-48 w-full"
                onMouseEnter={() => {
                  if (
                    workshop.introductoryVideoUrl &&
                    videoRefs.current[workshop.id]
                  ) {
                    videoRefs.current[workshop.id]
                      ?.play()
                      .catch((error) =>
                        console.warn("Video play failed:", error),
                      );
                  }
                }}
                onMouseLeave={() => {
                  if (
                    workshop.introductoryVideoUrl &&
                    videoRefs.current[workshop.id]
                  ) {
                    videoRefs.current[workshop.id]?.pause();
                    if (videoRefs.current[workshop.id]) {
                      // Check again before setting currentTime
                      videoRefs.current[workshop.id]!.currentTime = 0;
                    }
                  }
                }}
              >
                {workshop.bannerImage && (
                  <img
                    src={workshop.bannerImage}
                    alt={workshop.name}
                    className={`absolute left-0 top-0 h-full w-full object-cover transition-opacity duration-300 ${workshop.introductoryVideoUrl ? "group-hover:opacity-0" : "opacity-100"}`}
                  />
                )}
                {workshop.introductoryVideoUrl && (
                  <video
                    ref={(el) => {
                      if (videoRefs.current)
                        videoRefs.current[workshop.id] = el;
                    }}
                    src={workshop.introductoryVideoUrl}
                    className="absolute left-0 top-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
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
                  <div className="absolute left-0 top-0 h-full w-full bg-gray-200 transition-opacity duration-300 group-hover:opacity-0" />
                )}

                <div className="absolute top-3 right-3 z-20">
                  {renderStatusTag(workshop)}
                </div>
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                <CardHeader className="absolute bottom-0 left-0 right-0 z-20 p-3 text-white sm:p-4">
                  <CardTitle className="text-lg font-bold sm:text-xl">
                    {workshop.name}
                  </CardTitle>
                </CardHeader>
              </div>
            ) : (
              // Fallback if no banner and no video, regular CardHeader for title
              <CardHeader className="relative p-3 sm:p-4">
                <CardTitle>{workshop.name}</CardTitle>
                <div className="absolute top-3 right-3 z-20">
                  {renderStatusTag(workshop)}
                </div>
              </CardHeader>
            )}

            <CardContent className="flex-grow space-y-2 p-3 sm:p-4">
              <div className="text-sm text-gray-600 transition-colors group-hover:text-gray-900">
                {workshop.description.length > MAX_DESC_LENGTH ? (
                  <>
                    {`${workshop.description.substring(0, MAX_DESC_LENGTH)}... `}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click-through
                        router.push(
                          `/mentor-dashboard/workshops/${workshop.id}`,
                        );
                      }}
                      className="ml-1 inline font-medium text-primary hover:underline"
                    >
                      View Details
                    </button>
                    
                  </>
                ) : (
                  workshop.description
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 transition-colors group-hover:text-primary">
                <Calendar className="h-4 w-4 text-primary" />
                {workshop.scheduleType === "custom" &&
                workshop.schedule.length > 0 ? (
                  <span>{workshop?.schedule[0]?.date}</span>
                ) : (
                  <span>
                    {workshop.startDate
                      ? new Date(workshop.startDate).toLocaleDateString()
                      : "No start date"}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 transition-colors group-hover:text-primary">
                <Clock className="h-4 w-4 text-primary" />
                <span>
                  {workshop.schedule[0]?.time }
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4 text-primary" />
                <span>
                  {workshop._count?.enrollments || 0} student
                  {(workshop._count?.enrollments || 0) !== 1 ? "s" : ""}{" "}
                  enrolled
                </span>
              </div>

              <div className="mt-3 inline-block rounded-full bg-primary/5 px-3 py-1 text-lg font-bold text-primary transition-all group-hover:bg-primary/10">
                {formatPrice(workshop.price / 100)}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 border-t bg-gradient-to-r from-gray-50/80 to-white/80 p-3 backdrop-blur-sm transition-all group-hover:from-gray-100/80 group-hover:to-white/90 sm:flex-row sm:justify-between sm:gap-0 sm:p-4">
              <Button
                variant="default"
                className="w-full transition-all sm:w-auto"
                size="sm"
                onClick={() =>
                  router.push(`/mentor-dashboard/workshops/${workshop.id}`)
                }
              >
                <Eye className="mr-1 h-4 w-4" />
                View Details
              </Button>
              <div className="ml-4 flex w-full gap-2 sm:w-auto">
                <Button
                  variant="outline"
                  className="flex-1 transition-all hover:bg-primary/5 sm:flex-initial"
                  size="sm"
                  onClick={() => handleShare(workshop.id, workshop.name)}
                  title="Share workshop link"
                >
                  <Share2 className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 transition-all hover:bg-primary/5 sm:flex-initial"
                  size="sm"
                  onClick={() => setWorkshopToEdit(workshop)}
                  title="Edit workshop"
                >
                  <Edit className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 text-red-600 transition-all hover:bg-red-50 hover:text-red-700 sm:flex-initial"
                  size="sm"
                  onClick={() => setWorkshopToDelete(workshop.id)}
                  title="Delete workshop"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!workshopToDelete}
        onOpenChange={() => setWorkshopToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              workshop and remove all student enrollments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 text-white transition-colors hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit workshop modal */}
      {workshopToEdit && (
        <EditWorkshopModal
          workshop={workshopToEdit}
          isOpen={!!workshopToEdit}
          onClose={() => setWorkshopToEdit(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}
