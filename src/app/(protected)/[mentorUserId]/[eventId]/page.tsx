import React from "react";
import MeetingTimeDateSelection from "../_components/MeetingTimeDateSelection";
import { api } from "@/trpc/server";
import { db } from "@/server/db";
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

type Params = {
  mentorUserId: string;
  eventId: string;
};

export default async function Page({ params }: { params: Promise<Params> }) {
  const { mentorUserId, eventId } = await params;

  const user = await api.user.getMe();

  // Check if the current user is the mentor for this event
  if (user?.role === "MENTOR" && user?.id === mentorUserId) {
    // Redirect mentors away from their own event page
    return redirect("/mentor-dashboard");
  }

  // Continue with the page for non-mentors
  const eventDetails = await api.meetingEvent.getMeetingEventById({
    id: eventId,
  });

  const updatedEventDetails = {
    description: eventDetails?.description ?? "",
    id: eventDetails?.id ?? "",
    eventName: eventDetails?.eventName ?? "",
    duration: eventDetails?.duration ?? 0,
    meetEmail: eventDetails?.meetEmail ?? "",
  };

  const mentorUserDetails = await db.user.findUnique({
    where: {
      id: mentorUserId,
    },
    select: {
      email: true,
      name: true,
      mentor: {
        select: {
          availability: {
            select: {
              daysAvailable: true,
              bufferTime: true,
            },
          },
        },
      },
    },
  });

  const updatedMentorUserDetails = {
    mentorUserId: mentorUserId,
    email: mentorUserDetails?.email ?? "",
    name: mentorUserDetails?.name ?? "",
    daysAvailable: mentorUserDetails?.mentor?.availability?.daysAvailable ?? {},
    bufferTime: mentorUserDetails?.mentor?.availability?.bufferTime ?? 15,
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white px-4 py-6 sm:px-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <MeetingTimeDateSelection
          eventInfo={updatedEventDetails}
          mentorUserDetails={updatedMentorUserDetails}
        />
      </div>
    </div>
  );
}
