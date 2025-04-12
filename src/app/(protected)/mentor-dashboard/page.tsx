import { api } from "@/trpc/server";
import Link from "next/link";
import React from "react";
import ProgressChart from "./_components/ProgressChart";
import ScheduledSessions from "./_components/ScheduledSessions";

const Page = async () => {
  const scheduledSessions =
    await api.scheduledMeetings.getMentorScheduledMeetings();

  return (
    <div className="mx-auto min-h-[100dvh] w-full p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          Dashboard
        </h1>
      </div>

      {/* Progress Chart */}
      <div className="mb-6 overflow-hidden rounded-lg bg-white p-4 shadow-sm">
        <ProgressChart />
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
};

export default Page;
