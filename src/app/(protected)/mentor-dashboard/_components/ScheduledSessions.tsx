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
  const displaySessions =
    sessions.length > 0
      ? sessions
      : [
          {
            id: "1",
            title: "Looking for a Data Science Job?",
            description:
              "Discover the keys to success in the Data Science job market",
            date: "October 2025",
            time: "6-7pm",
          },
          {
            id: "2",
            title: "Cyber-security Career Path",
            description: "Learn more about the opportunities in Cyber Security",
            date: "September 2025",
            time: "7-8pm",
          },
          {
            id: "3",
            title: "How to kick-start your IT career",
            description: "Tips and tricks on how to start a lifelong journey",
            date: "August 2025",
            time: "7-8pm",
          },
        ];

  return (
    <div className="space-y-3">
      {displaySessions.map((session) => (
        <div
          key={session.id}
          className="flex flex-col overflow-hidden rounded-md bg-white shadow-sm md:flex-row"
        >
          <div className="flex w-full flex-col justify-between p-4 md:w-auto md:min-w-28">
            <div className="text-2xl font-semibold">
              {session.date.split(" ")[0].slice(0, 2)}
              <span className="text-base">th</span>
            </div>
            <div className="text-sm text-gray-500">
              {session.date.split(" ")[1]}
            </div>
          </div>

          <div className="flex-1 border-t border-gray-200 p-4 md:border-l md:border-t-0">
            <div className="mb-2 text-base font-medium">{session.title}</div>
            <p className="mb-3 text-sm text-gray-600">{session.description}</p>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="mr-1 h-4 w-4" />
              {session.time}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduledSessions;
