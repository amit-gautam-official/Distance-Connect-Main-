"use client";

import React from "react";
import { CalendarIcon, Clock } from "lucide-react";
import Link from "next/link";

type ScheduledSession = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  meetUrl?: string;
};

interface ScheduledSessionsProps {
  sessions: ScheduledSession[];
}

const ScheduledSessions: React.FC<ScheduledSessionsProps> = ({ sessions }) => {
  // If no sessions are provided or the array is empty, show mock data
  const displaySessions = sessions;


  if (displaySessions.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">No scheduled sessions</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displaySessions.map((session) => (
        <div
          key={session.id}
          className="flex flex-col overflow-hidden rounded-md bg-white shadow-sm md:flex-row"
        >
          <div className="flex w-full flex-row justify-between p-3 md:w-auto md:min-w-28 md:flex-col md:justify-between md:p-4">
            <div className="text-xl font-semibold md:text-2xl">
              {session?.date?.split(" ")[0]?.slice(0, 2)}
              <span className="text-sm md:text-base">th</span>
            </div>
            <div className="text-xs text-gray-500 md:text-sm">
              {session.date.split(" ")[1]}
            </div>
          </div>

          <div className="flex-1 border-t border-gray-200 p-3 md:border-l md:border-t-0 md:p-4">
            <div className="mb-1 text-sm font-medium md:mb-2 md:text-base">
              {session.title}
            </div>
            <p className="mb-2 text-xs text-gray-600 md:mb-3 md:text-sm">
              {session.description}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
              <div className="flex items-center text-xs text-gray-500 md:text-sm">
                <Clock className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                {session.time}
              </div>
              {session.meetUrl && (
                <Link
                  href={session.meetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md bg-[#5580D6] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#5580D6]/90 md:text-sm"
                >
                  Join Now
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduledSessions;
