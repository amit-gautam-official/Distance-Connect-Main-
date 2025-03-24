"use client";
import { Button } from "@/components/ui/button";
import { Clock, Copy, MapPin, Pen, Settings, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/trpc/react";

type MeetingEvent = {
  description: string | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  eventName: string;
  duration: number;
  mentorUserId: string;
};
function MeetingEventList() {
  const { data, isError, isLoading, refetch } =
    api.meetingEvent.getMeetingEventList.useQuery(undefined, {
      // Reduce retries to avoid rate limit issues
      retry: 1,
      // Increase staleTime to reduce refetches
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  const deleteMeetingEvent = api.meetingEvent.deleteMeetingEvent.useMutation({
    onSuccess: () => {
      toast("Meeting Event Deleted!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDeleteMeetingEvent = async (event: MeetingEvent) => {
    await deleteMeetingEvent.mutateAsync({
      id: event.id,
    });
  };

  const onCopyClickHandler = (event: MeetingEvent) => {
    const meetingEventUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000" + "/" + event.mentorUserId + "/" + event.id
        : process.env.NEXT_PUBLIC_BASE_URL +
          "/" +
          event.mentorUserId +
          "/" +
          event.id;
    navigator.clipboard.writeText(meetingEventUrl);
    toast("Copied to Clicpboard");
  };
  return (
    <div className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
      {data && data?.length > 0 ? (
        data?.map((event, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 rounded-lg border border-t-8 p-5 shadow-md"
          >
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Settings className="cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="flex gap-2"
                    onClick={() => onDeleteMeetingEvent(event)}
                  >
                    {" "}
                    <Trash /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <h2 className="text-xl font-medium">{event?.eventName}</h2>
            <div className="flex justify-between">
              <h2 className="flex gap-2 text-gray-500">
                <Clock /> {event.duration} Min{" "}
              </h2>
            </div>
            <hr></hr>
            <div className="flex justify-between">
              <h2
                className="flex cursor-pointer items-center gap-2 text-sm text-primary"
                onClick={() => {
                  onCopyClickHandler(event);
                }}
              >
                <Copy className="h-4 w-4" /> Copy Link{" "}
              </h2>
              <Button
                variant="outline"
                className="rounded-full border-primary text-primary"
              >
                Share
              </Button>
            </div>
          </div>
        ))
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
}

export default MeetingEventList;
