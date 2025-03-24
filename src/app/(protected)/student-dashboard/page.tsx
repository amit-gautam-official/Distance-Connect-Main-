import React from "react";
import { api } from "@/trpc/server";
import { Metadata } from "next";

// Component imports
import ExploreMentorsBanner from "./components/ExploreMentorsBanner";
import DashboardStats from "./components/DashboardStats";
import TrackSessions from "./components/TrackSessions";
import YourMentors from "./components/YourMentors";
import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Student Dashboard | Distance Connect",
  description:
    "Manage your mentorship journey, meetings, and learning progress",
};

const StudentDashboardPage = async () => {
  const session = await auth0.getSession();
  if (!session) {
    redirect("/");
  }
  const student = await api.student.getStudent();

  const mentorsData = Array.from(
    new Set(student?.scheduledMeetings?.map((meeting) => meeting.mentor.id)),
  ).map((mentorId) => {
    const meeting = student?.scheduledMeetings?.find(
      (m) => m.mentor.id === mentorId,
    );
    return {
      id: meeting?.mentor.id ?? "",
      mentorUserId: meeting?.mentor.userId ?? "",
      name: meeting?.mentor.user.name ?? "",
      role: meeting?.mentor.user.role ?? "",
      company: meeting?.mentor.currentCompany ?? "",
      expertise: meeting?.mentor.hiringFields ?? [],
      avatarUrl: meeting?.mentor.user.avatarUrl ?? "",
      isFollowing: false,
      rating: 4,
      selectedTime: meeting?.selectedTime ?? "",
      formatedDate: meeting?.formatedDate ?? "",
      formatedTimeStamp: meeting?.formatedTimeStamp ?? "",
      duration: meeting?.duration ?? 0,
      meetUrl: meeting?.meetUrl ?? "",
      eventName: meeting?.eventName ?? "",
      userNote: meeting?.userNote ?? "",
    };
  });
  // Mock data for stats
  const stats = {
    sessionsCompleted: 75,
    sessionsCompletedTrend: "8.5%",
    totalTimeSpent: 8900,
    totalTimeSpentTrend: "4.3%",
    totalPending: 2,
  };

  // Mock data for session tracking
  const sessionData = [
    { month: "JAN", count: 8 },
    { month: "FEB", count: 7 },
    { month: "MAR", count: 12 },
    { month: "APR", count: 5 },
    { month: "MAY", count: 9 },
    { month: "JUN", count: 7 },
  ];

  // Mock data for mentors
  const mentors = [
    {
      id: "1",
      name: "Prashant Singh",
      date: "25/2/2023",
      courseType: "FRONTEND",
      courseTitle: "Understanding Concept Of React",
      image: undefined,
    },
    {
      id: "2",
      name: "Ravi Kumar",
      date: "25/2/2023",
      courseType: "FRONTEND",
      courseTitle: "Understanding Concept Of React",
      image: undefined,
    },
  ];

  return (
    <div className="container mx-auto  w-full px-4 py-6">
      {/* Explore Mentors Banner */}
      <ExploreMentorsBanner />

      {/* Stats Cards */}
      <div className="mt-6">
        <DashboardStats stats={stats} />
      </div>

      {/* Main Content */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Track Sessions Chart */}
        <TrackSessions sessionData={sessionData} />

        {/* Your Mentors */}
        <YourMentors mentors={mentorsData} />
      </div>
    </div>
  );
};

export default StudentDashboardPage;
