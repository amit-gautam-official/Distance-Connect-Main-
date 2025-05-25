"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { Calendar, Clock, Edit, Eye, Trash, Users } from "lucide-react";
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

type Workshop = {
  id: string;
  name: string;
  description: string;
  numberOfDays: number;
  schedule: ScheduleItem[];
  scheduleType: "recurring" | "custom";
  startDate?: string | null;
  price: number;
  learningOutcomes: string[];
  courseDetails: Record<string, any>;
  otherDetails: string | null;
  meetUrl: string | null;
  introductoryVideoUrl: string | null;
  createdAt: Date;
  _count?: { enrollments: number };
  bannerImage: string | null;
  mentorGmailId: string;
};

interface WorkshopListProps {
  workshops: Workshop[];
  isLoading: boolean;
  onRefresh: () => void;
}

export default function WorkshopList({ workshops, isLoading, onRefresh }: WorkshopListProps) {
  const router = useRouter();
  const [workshopToDelete, setWorkshopToDelete] = useState<string | null>(null);
  const [workshopToEdit, setWorkshopToEdit] = useState<Workshop | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const MAX_DESC_LENGTH = 150; // Maximum characters for description

  const deleteWorkshop = api.workshop.deleteWorkshop.useMutation({
    onSuccess: () => {
      toast.success("Workshop deleted successfully");
      onRefresh();
    },
    onError: (error) => {
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
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <CardHeader className="absolute bottom-0 left-0 right-0 text-white">
                  <CardTitle className="text-xl font-bold">{workshop.name}</CardTitle>
                </CardHeader>
              </div>
            ) : (
              <CardHeader>
                <CardTitle>{workshop.name}</CardTitle>
              </CardHeader>
            )}
            <CardContent className="p-3 sm:p-4 space-y-3">
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
            <CardFooter className="flex justify-between p-3 sm:p-4 border-t">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
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
                    src={workshop.bannerImage }
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
                </CardHeader>
              </div>
            ) : (
              // Fallback if no banner and no video, regular CardHeader for title
              <CardHeader className="p-3 sm:p-4">
                <CardTitle>{workshop.name}</CardTitle>
              </CardHeader>
            )}
            
            <CardContent className="p-3 sm:p-4 space-y-2 flex-grow">
              <div className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                {workshop.description.length > MAX_DESC_LENGTH ? (
                  <>
                    {`${workshop.description.substring(0, MAX_DESC_LENGTH)}... `}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click-through
                        router.push(`/mentor-dashboard/workshops/${workshop.id}`);
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
              
              <div className="flex items-center gap-2 text-sm text-gray-600 group-hover:text-primary transition-colors">
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  {workshop.schedule.map(s => s.day).join(", ")}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 group-hover:text-primary transition-colors">
                <Clock className="h-4 w-4 text-primary" />
                <span>
                  {workshop.schedule.map(s => s.time).join(", ")}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4 text-primary" />
                <span>
                  {workshop._count?.enrollments || 0} student{(workshop._count?.enrollments || 0) !== 1 ? "s" : ""} enrolled
                </span>
              </div>
              
              <div className="mt-3 text-lg font-bold text-primary bg-primary/5 inline-block px-3 py-1 rounded-full group-hover:bg-primary/10 transition-all">
                {formatPrice(workshop.price)}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between p-3 sm:p-4 border-t bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm group-hover:from-gray-100/80 group-hover:to-white/90 transition-all">
              
              <Button
                variant="default"
                className="w-full sm:w-auto transition-all "
                size="sm"
                onClick={() => router.push(`/mentor-dashboard/workshops/${workshop.id}`)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
              <div className="flex gap-2 w-full ml-4 sm:w-auto">
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-initial transition-all hover:bg-primary/5"
                  size="sm"
                  onClick={() => setWorkshopToEdit(workshop)}
                >
                  <Edit className="h-4 w-4" />
                  
                </Button>
                
              <Button
                  variant="outline"
                  className="flex-1 sm:flex-initial text-red-600 hover:text-red-700 hover:bg-red-50 transition-all"
                  size="sm"
                  onClick={() => setWorkshopToDelete(workshop.id)}
                >
                  <Trash className="h-4 w-4" />
                  
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!workshopToDelete} onOpenChange={() => setWorkshopToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the workshop
              and remove all student enrollments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700 transition-colors"
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
