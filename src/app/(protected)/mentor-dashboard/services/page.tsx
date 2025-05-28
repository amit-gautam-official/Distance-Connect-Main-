"use client"
import React, { useEffect } from "react";
import MeetingEventSkeleton from "./_components/MeetingEventSkeleton";

import MeetingEventList from "./_components/MeetingEventList";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { api } from "@/trpc/react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export default function ServicesPage() {
  const { data: mentor, isLoading } = api.mentor.getMentor.useQuery()
  const TOUR_STORAGE_KEY = "mentor-services-tour-shown";


  // Function to start the tour
  const startTour = () => {
    if (typeof window === "undefined") return;

    const driverObj = driver({
      showProgress: true,
      steps: [  
    {
      element: '#create-service',
      popover: {
        title: 'Create New Meeting Type',
        description: 'Set up a new meeting type to offer your services to students. Note: You must create at least one meeting type and define your availability before students can book sessions with you.',
        side: "right",  
        align: 'start',
      }
    },
    {
      element: '#meeting',
      popover: {
        title: 'Meeting Services',
        description: 'Here you can manage your meeting types and view scheduled meetings.',
        side: "right",  
        align: 'start',
      }
    },
    
  ],

    });

    driverObj.drive();
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
  };

  // Run tour only once on initial load if not done before
  useEffect(() => {
    if (typeof window === "undefined") return;  
    
    const hasRunTour = localStorage.getItem(TOUR_STORAGE_KEY ) === "true";

    if (!isLoading && mentor?.verified &&  !hasRunTour) {
      const el = document.querySelector("#meeting");
      if (el) {
      setTimeout(() => {
        startTour();
      }, 500);
      }

    }
  }, [isLoading]);



  if(!mentor?.verified && !isLoading){
    return(
      //show a message to verify the account
      <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Meeting Services</h1>
            <p className="mt-2 text-gray-600">Your account is under verification. Please wait!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div id="meeting" className="container mx-auto px-4 py-4 sm:px-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Meeting Services</h1>
          <p className="mt-2 text-gray-600">Manage your meeting types</p>
        </div>
        <Link id="create-service" href="/create-meeting">
          <Button className="flex w-full items-center gap-2 sm:w-auto">
            <Plus className="h-4 w-4" />
            Create New Meeting Type
          </Button>
        </Link>
      </div>

      <div className="mb-20 rounded-lg sm:p-6 md:mb-0">
        {
          isLoading ? (
            <MeetingEventSkeleton />
          ) : (
            <MeetingEventList />
          )
        }
      </div>
    </div>
  );
}