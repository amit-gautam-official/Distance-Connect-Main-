"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
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
  meetUrl: string | null; // This seems to be for individual meeting URLs, not the intro video
  introductoryVideoUrl: string | null; // Added for the workshop's intro video
  createdAt: Date;
  _count?: { enrollments: number };
  bannerImage: string | null;
  scheduleType: "recurring" | "custom";
  startDate: string | null;
  mentorGmailId: string;
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
      schedule: typedSchedule,
      introductoryVideoUrl: workshop.introductoryVideoUrl || null,
    };
  }) as Workshop[] | undefined;

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    void refetch();
    toast.success("Workshop created successfully!");
  };
  

  if (workshops?.length === 0 && !isLoading) {
    return (
      <div className="container flex justify-center items-center h-[100dvh] w-full mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">No Workshops Available</h2>
          <p className="mt-2 text-gray-600">
            You have not created any workshops yet. Click the button below to create your first workshop.
          </p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="mt-4 flex items-center justify-center gap-2 m-auto mt-6"
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
      </div>  
    );
  }
  

  if(isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Loading state */}
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-600">Loading workshops...</p>
        </div>
      </div>
    );
  }

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
        id="create-workshop"
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
      <div id="workshop-list">

      <WorkshopList
        workshops={workshops || []}
        isLoading={isLoading}
        onRefresh={() => void refetch()}
      />
      </div>
    </div>
  );
}
