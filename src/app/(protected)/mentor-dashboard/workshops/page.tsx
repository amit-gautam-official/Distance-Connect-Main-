"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import WorkshopList from "./_components/WorkshopList";
import CreateWorkshopModal from "./_components/CreateWorkshopModal";


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
export default function WorkshopsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: workshopsData, isLoading, refetch } = api.workshop.getMentorWorkshops.useQuery();
  
  // Transform the data to ensure schedule property is properly typed
  const workshops = workshopsData?.map(workshop => {
    // Properly transform the schedule array to match the expected type
    const typedSchedule = Array.isArray(workshop.schedule)
      ? workshop.schedule
        .filter((item): item is { day: string; time: string } => 
          item !== null && 
          typeof item === 'object' && 
          'day' in item && 
          typeof item.day === 'string' &&
          'time' in item && 
          typeof item.time === 'string')
      : [];
      
    return {
      ...workshop,
      schedule: typedSchedule
    };
  }) as Workshop[] | undefined;

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    void refetch();
    toast.success("Workshop created successfully!");
  };

  return (
    <div className="container mx-auto pb-16 md:pb-6 px-4 sm:px-6 py-4 sm:py-6">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Workshops</h1>
          <p className="mt-1 text-sm sm:text-base text-gray-600">
            Create and manage your workshops for students
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Create Workshop
        </Button>
      </div>

      <CreateWorkshopModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <WorkshopList
        workshops={workshops || []}
        isLoading={isLoading}
        onRefresh={() => void refetch()}
      />
    </div>
  );
}
