"use client"
import React, { useEffect } from "react";
import MeetingEventSkeleton from "./_components/MeetingEventSkeleton";

import MeetingEventList from "./_components/MeetingEventList";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { api } from "@/trpc/react";

export default function ServicesPage() {
  const { data: mentor, isLoading } = api.mentor.getMentor.useQuery()





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
    <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Meeting Services</h1>
          <p className="mt-2 text-gray-600">Manage your meeting types</p>
        </div>
        <Link href="/create-meeting">
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