"use client";
import React from "react";
import MeetingEventList from "../meeting/meeting-type/_components/MeetingEventList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const ServicesPage = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Meeting Services</h1>
          <p className="mt-2 text-gray-600">Manage your meeting types</p>
        </div>
        <Button
          onClick={() => router.push("/create-meeting")}
          className="flex w-full items-center gap-2 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Create New Meeting Type
        </Button>
      </div>

      <div className="rounded-lg p-4 sm:p-6">
        <MeetingEventList />
      </div>
    </div>
  );
};

export default ServicesPage;
