import React from "react";
import dynamic from "next/dynamic";
import MeetingEventSkeleton from "./_components/MeetingEventSkeleton";

const MeetingEventList = dynamic(() => import("./_components/MeetingEventList"), {
  loading: () => <MeetingEventSkeleton />,
});
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { api } from "@/trpc/server";

export default async function ServicesPage() {
  const mentor = await api.mentor.getMentor()


  if(!mentor?.verified){
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
        <MeetingEventList />
      </div>
    </div>
  );
}