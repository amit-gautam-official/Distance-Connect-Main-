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
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
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
            workshops={availableWorkshops?.map(workshop => {
              // Ensure schedule is properly typed as { day: string; time: string; }[]
              const typedWorkshop = workshop as unknown as Workshop;
              if (typedWorkshop.schedule && Array.isArray(typedWorkshop.schedule)) {
                // Make sure schedule has the correct shape
                typedWorkshop.schedule = typedWorkshop.schedule.map(s => {
                  if (typeof s === 'object' && s !== null) {
                    return {
                      day: typeof s.day === 'string' ? s.day : String(s.day),
                      time: typeof s.time === 'string' ? s.time : String(s.time)
                    };
                  }
                  return { day: '', time: '' }; // Fallback for invalid data
                });
              }
              return typedWorkshop;
            }) || []} 
            isLoading={isLoadingAvailable}
            isEnrolled={false}
            onEnrollmentSuccess={() => {
              void refetchEnrolled();
              setActiveTab("enrolled");
            }}
          />
        </TabsContent>

        <TabsContent value="enrolled">
          <WorkshopList 
            workshops={enrolledWorkshops?.map(e => {
              // Ensure schedule is properly typed as { day: string; time: string; }[]
              const workshop = e.workshop as unknown as Workshop;
              if (workshop.schedule && Array.isArray(workshop.schedule)) {
                // Make sure schedule has the correct shape
                workshop.schedule = workshop.schedule.map(s => {
                  if (typeof s === 'object' && s !== null) {
                    return {
                      day: typeof s.day === 'string' ? s.day : String(s.day),
                      time: typeof s.time === 'string' ? s.time : String(s.time)
                    };
                  }
                  return { day: '', time: '' }; // Fallback for invalid data
                });
              }
              return workshop;
            }) || []} 
            isLoading={isLoadingEnrolled}
            isEnrolled={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
