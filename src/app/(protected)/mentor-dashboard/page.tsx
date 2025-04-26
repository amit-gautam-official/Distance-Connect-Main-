import { api } from "@/trpc/server";
import Link from "next/link";
import React from "react";
import { X } from "lucide-react";
import ProgressChart from "./_components/ProgressChart";
import ScheduledSessions from "./_components/ScheduledSessions";

export default async function Page() {
  try {
    // Fetch data using server-side API calls
    const [mentor, scheduledSessions] = await Promise.all([
      api.mentor.getMentor(),
      api.scheduledMeetings.getMentorScheduledMeetings()
    ]);

    return (
      <div className="mx-auto min-h-[100dvh] w-full p-4 md:p-8">
        {/* Header */}
        {mentor?.companyEmailVerified ? (
          <div className="mb-6 flex items-center justify-between rounded-lg bg-green-50 p-4 text-sm text-green-800">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 1v22M1 12h22" />
              </svg>
              <span className="font-medium">Company Email Verified</span>
            </div>
            <Link
              href="/mentor-dashboard/profile"
              className="text-sm text-blue-600 hover:underline"
            >
              Update Profile
            </Link>
          </div>
        ) : (
          <div className="mb-6 flex items-center justify-between rounded-lg bg-red-50 p-4 text-sm text-red-800">
            <div className="flex items-center gap-2">
              <X className="h-5 w-5 text-red-500" />
              <span className="font-medium">Company Email Not Verified</span>
            </div>
            <Link
              href="/mentor-dashboard/profile"
              className="text-sm text-blue-600 hover:underline"
            >
              Verify Now
            </Link>
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Dashboard
          </h1>
        </div>

        {/* Progress Chart */}
        <div className="mb-6 overflow-hidden rounded-lg bg-white p-4 shadow-sm">
          <ProgressChart scheduledSessions={scheduledSessions} />
        </div>

        {/* Scheduled Sessions */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Your Scheduled Sessions
            </h2>
            <Link
              href="/mentor-dashboard/meetings"
              className="text-sm text-blue-600"
            >
              See All
            </Link>
          </div>
          <div className="space-y-4">
            <ScheduledSessions sessions={scheduledSessions} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in mentor dashboard:", error);
    return (
      <div className="mx-auto min-h-[100dvh] w-full p-4 md:p-8">
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
          {error instanceof Error 
            ? `Error loading dashboard: ${error.message}`
            : "An unexpected error occurred loading the dashboard"}
        </div>
      </div>
    );
  }
}