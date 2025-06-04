"use client";
import { api } from "@/trpc/react";
import Link from "next/link";
import React, { useEffect } from "react";
import { X } from "lucide-react";
import ProgressChart from "./_components/ProgressChart";
import ScheduledSessions from "./_components/ScheduledSessions";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { MentorDashboardSkeleton } from "./_components/MentorDashboardSkeleton";

export default function Page() {
  const { data: mentor, isLoading: isMentorLoading } = api.mentor.getMentor.useQuery();
  const { data: scheduledSessions, isLoading: isScheduledSessionLoading } = api.scheduledMeetings.getMentorScheduledMeetings.useQuery();

  const startTour = () => {
  const driverObj = driver({
  showProgress: true,
  steps: [
    {
      element: '#dashboard',
      popover: {
        title: 'Dashboard',
        description: 'This is the main area where you can track your mentoring activity.',
        side: "right",
        align: 'start',
      }
    },
    {
      element: '#profile',
      popover: {
        title: 'Profile',
        description: 'Update your personal and professional information here including your Availability.',
        side: "right",
        align: 'start',
      }
    },
    {
      element: '#meetings',
      popover: {
        title: 'Meetings',
        description: 'View and manage your scheduled mentoring sessions.',
        side: "right",
        align: 'start',
      }
    },
    {
      element: '#workshops',
      popover: {
        title: 'Workshops',
        description: 'Create and manage your workshops.',
        side: "right",
        align: 'start',
      }
    },
    {
      element: '#inbox',
      popover: {
        title: 'Inbox',
        description: 'Check your messages and communicate with your students.',
        side: "right",
        align: 'start',
      }
    },
    {
      element: '#services',
      popover: {
        title: 'Services',
        description: 'Create and manage the services/offerings you offer to mentees. Create a service to start mentoring.',
        side: "right",
        align: 'start',
      }
    },
    {
      element: '#help-support',
      popover: {
        title: 'Help & Support',
        description: 'Reach out for help or view FAQs and support documents.',
        side: "right",
        align: 'start',
      }
    },

  ]
});
  driverObj.drive();
  localStorage.setItem("hasSeenMentorTour", "true");
};


useEffect(() => {
  if (!isMentorLoading && !isScheduledSessionLoading && typeof window !== "undefined") {
    const hasSeenTour = localStorage.getItem("hasSeenMentorTour");
    if (hasSeenTour === "true") return;

    const interval = setInterval(() => {
      const el = document.querySelector("#dashboard");
      if (el) {
        startTour();
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }
}, [isMentorLoading, isScheduledSessionLoading]);

  if (isMentorLoading || isScheduledSessionLoading) {
    return (
      <div className="mx-auto min-h-[100dvh] w-full p-4 md:p-8">
        <div className="flex items-center justify-center h-full">
         <MentorDashboardSkeleton/>
        </div>
      </div>
    );
  }

  return (
    <div  className="mx-auto  min-h-[100dvh] w-full p-4 md:p-8">
      {/* Admin Message */}
      {mentor?.messageFromAdmin && (
        <div className="mb-6 flex items-center justify-between rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 24 24" fill="none">
              <path d="M12 1v22M1 12h22" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="font-medium">{mentor.messageFromAdmin}</span>
          </div>
          <Link href="/mentor-dashboard/profile" className="text-sm text-blue-600 hover:underline">
            Update Profile
          </Link>
        </div>
      )}

      {/* Email Verification Warning */}
      {!mentor?.companyEmailVerified && (
        <div className="mb-6 flex items-center justify-between rounded-lg bg-red-50 p-4 text-sm text-red-800">
          <div className="flex items-center gap-2">
            <X className="h-5 w-5 text-red-500" />
            <span className="font-medium">Company Email Not Verified</span>
          </div>
          <Link href="/mentor-dashboard/profile" className="text-sm text-blue-600 hover:underline">
            Verify Now
          </Link>
        </div>
      )}

      {/* Dashboard Title */}
      <div  className="mb-6">
        <h1  className="text-2xl font-bold text-gray-900 md:text-3xl">
          Dashboard
        </h1>
      </div>

      {/* Progress Chart */}
      <div className="mb-6 overflow-hidden rounded-lg bg-white p-4 shadow-sm">
        <ProgressChart scheduledSessions={scheduledSessions!} />
      </div>

      {/* Scheduled Sessions */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Your Scheduled Sessions</h2>
          <Link href="/mentor-dashboard/meetings" className="text-sm text-blue-600">
            See All
          </Link>
        </div>
        <div className="space-y-4">
          <ScheduledSessions sessions={scheduledSessions!} />
        </div>
      </div>
    </div>
  );
}
