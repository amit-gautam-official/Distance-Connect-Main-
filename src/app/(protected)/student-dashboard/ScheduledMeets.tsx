"use client";

import React from "react";
import { api } from "@/trpc/react";

// Import shadcn/ui components
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ScheduledMeets = () => {
  const { data, isError, isLoading } =
    api.scheduledMeetings.getScheduledMeetingsListByStudent.useQuery(
      undefined,
      {
        // Reduce retries to avoid rate limit issues
        retry: 1,
        // Increase staleTime to reduce refetches
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-red-500">Error loading scheduled meetings</p>
      </div>
    );
  }

  // Split meetings into upcoming and expired based on the current date/time.
  // Adjust this logic as needed (for example, consider the meeting time if needed).

  const filterMeetingList = (type: string) => {
    const currentTimestamp = new Date().getTime();
    if (type == "upcoming") {
      return data?.filter(
        (item) => Number(item?.formatedTimeStamp) >= Number(currentTimestamp),
      );
    } else {
      return data?.filter(
        (item) => Number(item?.formatedTimeStamp) < Number(currentTimestamp),
      );
    }
  };
  const renderTable = (meetings: typeof data) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/12">ID</TableHead>
          <TableHead className="w-1/6">Date</TableHead>
          <TableHead className="w-1/6">Time</TableHead>
          <TableHead className="w-1/6">Duration</TableHead>
          <TableHead className="w-1/6">Mentor</TableHead>
          <TableHead className="w-1/6">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {meetings.map((meeting) => (
          <TableRow key={meeting.id}>
            {/* Displaying a shortened ID for brevity */}
            <TableCell>{meeting.id.slice(0, 8)}</TableCell>
            <TableCell>{meeting.formatedDate}</TableCell>
            <TableCell>{meeting.formatedTimeStamp}</TableCell>
            <TableCell>{meeting.duration} mins</TableCell>
            <TableCell>{meeting.mentorUserId}</TableCell>
            <TableCell>
              <a
                href={meeting.meetUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Join Meeting
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* Upcoming Meetings Section */}
      <Card>
        <div className="p-6">
          <h2 className="mb-6 text-2xl font-bold">Upcoming Meetings</h2>
          {filterMeetingList("upcoming")!.length > 0 ? (
            renderTable(filterMeetingList("upcoming")!)
          ) : (
            <p className="text-gray-500">No upcoming meetings found.</p>
          )}
        </div>
      </Card>

      {/* Expired Meetings Section */}
      <Card>
        <div className="p-6">
          <h2 className="mb-6 text-2xl font-bold">Expired Meetings</h2>
          {filterMeetingList("expired")!.length > 0 ? (
            renderTable(filterMeetingList("expired")!)
          ) : (
            <p className="text-gray-500">No expired meetings found.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ScheduledMeets;
