"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useState } from "react";
import WorkshopList from "./[workshopId]/_components/WorkshopList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the Workshop type based on what WorkshopList expects
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
  createdAt: Date;
  bannerImage: string | null;
  introductoryVideoUrl: string | null;
  scheduleType: string;

  mentor: {
    mentorName: string;
    user: {
      name: string | null;
      image: string | null;
    };
  };
  _count?: { enrollments: number };
};

export default function StudentWorkshopsPage() {
  const [activeTab, setActiveTab] = useState("available");
  
  // Fetch all available workshops
  const { 
    data: availableWorkshops, 
    isLoading: isLoadingAvailable 
  } = api.workshop.getAllWorkshops.useQuery();
  
  // Fetch enrolled workshops
  const { 
    data: enrolledWorkshops, 
    isLoading: isLoadingEnrolled,
    refetch: refetchEnrolled
  } = api.workshop.getEnrolledWorkshops.useQuery();

  return (
    <div className="container mx-auto pb-16 md:pb-0 px-2 md:px-4 sm:px-6 py-4 sm:py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Workshops</h1>
        <p className="mt-1 text-gray-600">
          Discover and join interactive workshops led by industry experts
        </p>
      </div>

      <Tabs 
        defaultValue="available" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="available">Available Workshops</TabsTrigger>
          <TabsTrigger value="enrolled">
            My Workshops {enrolledWorkshops?.length ? `(${enrolledWorkshops.length})` : ''}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available">
          <WorkshopList 
            workshops={availableWorkshops!}
            isLoading={isLoadingAvailable}
            isEnrolled={false}
            enrolledWorkshopIds={enrolledWorkshops?.map(enrollment => enrollment.workshop.id) || []}
            onEnrollmentSuccess={() => {
              void refetchEnrolled();
              setActiveTab("enrolled");
            }}
          />
        </TabsContent>

        <TabsContent value="enrolled">
          <WorkshopList 
            // workshops={enrolledWorkshops?.map(enrollment => {
            //   const originalWorkshop = enrollment.workshop as unknown as Workshop;

            //   let processedSchedule: Array<Record<string, string | undefined | null>>;

            //   if (originalWorkshop.schedule && Array.isArray(originalWorkshop.schedule)) {
            //     processedSchedule = originalWorkshop.schedule.map(s => {
            //       if (typeof s === 'object' && s !== null) {
            //         if (originalWorkshop.scheduleType === "recurring") {
            //           return {
            //             day: typeof s.day === 'string' ? s.day : String(s.day ?? 'N/A'),
            //             time: typeof s.time === 'string' ? s.time : String(s.time ?? 'N/A')
            //           };
            //         } else { // 'custom' scheduleType
            //           return {
            //             date: typeof s.date === 'string' ? s.date : String(s.date ?? new Date().toISOString()),
            //             startTime: typeof s.startTime === 'string' ? s.startTime : String(s.startTime ?? "09:00"),
            //             endTime: typeof s.endTime === 'string' ? s.endTime : String(s.endTime ?? "17:00")
            //           };
            //         }
            //       }
            //       // Fallback for s if not a valid object or if s is null/not an object
            //       if (originalWorkshop.scheduleType === "recurring") {
            //         return { day: 'N/A', time: 'N/A' };
            //       } else { // 'custom'
            //         return { date: new Date().toISOString(), startTime: "09:00", endTime: "17:00" };
            //       }
            //     });
            //   } else {
            //     // If originalWorkshop.schedule doesn't exist or isn't an array, initialize processedSchedule as empty
            //     processedSchedule = [];
            //   }

            //   // Return a new workshop object with all original properties and the processed schedule
            //   return {
            //     ...originalWorkshop,
            //     schedule: processedSchedule,
            //   };
            // })} 
            workshops={enrolledWorkshops?.map(enrollment => enrollment.workshop) || []}
            isLoading={isLoadingEnrolled}
            isEnrolled={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
