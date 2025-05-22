"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { Calendar, Clock, Edit, Eye, Trash, Users } from "lucide-react";
import { useState } from "react";
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
  price: number;
  learningOutcomes: string[];
  courseDetails: Record<string, any>;
  otherDetails: string | null;
  meetUrl: string | null;
  createdAt: Date;
  _count?: { enrollments: number };
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
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-16 bg-gray-200 rounded-t-lg"></CardHeader>
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
      <div className="flex flex-col items-center justify-center p-4 sm:p-8 text-center border rounded-lg bg-gray-50/80 backdrop-blur-sm shadow-sm mx-2 sm:mx-4 border-gray-100">
        <h3 className="text-lg font-medium text-gray-900">No workshops yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Create your first workshop to get started
        </p>
        <Button onClick={() => router.refresh()} className="mt-4">
          Refresh
        </Button>
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
          <Card key={workshop.id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-white/80 backdrop-blur-sm border border-gray-100">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/0 pb-2 group-hover:from-primary/10 group-hover:to-primary/5 transition-all">
              <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                {workshop.name}
              </h3>
              <p className="text-sm text-gray-500">
                {workshop.numberOfDays} day{workshop.numberOfDays > 1 ? "s" : ""} workshop
              </p>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 space-y-3">
              <p className="text-sm text-gray-600 line-clamp-2">
                {workshop.description}
              </p>
              
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
