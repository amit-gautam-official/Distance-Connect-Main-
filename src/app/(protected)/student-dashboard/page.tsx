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

  const filterMeetingList = (type: string) => {
    const currentTimestamp = new Date().getTime();
    if (type == "upcoming") {
      return student?.scheduledMeetings?.filter(
        (item) =>
          Number(item?.formatedTimeStamp) >= Number(currentTimestamp) &&
          !item?.completed,
      );
    } else if (type == "completed") {
      return student?.scheduledMeetings?.filter((item) => item?.completed);
    } else if (type == "missed") {
      return student?.scheduledMeetings?.filter(
        (item) =>
          Number(item?.formatedTimeStamp) < Number(currentTimestamp) &&
          !item?.completed,
      );
    }
  };

  const mentorsData = filterMeetingList("upcoming")?.map((meeting) => {
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

  console.log("mentorsData", mentorsData);

  const completedSessions = student?.scheduledMeetings?.filter(
    (m) => m.completed === true,
  );
  // Mock data for stats
  const stats = {
    sessionsCompleted: completedSessions?.length ?? 0,
    sessionsCompletedTrend: "8.5%",
    totalTimeSpent:
      completedSessions?.reduce((acc, curr) => acc + curr.duration, 0) ?? 0,
    totalTimeSpentTrend: "4.3%",
    totalPending:
      (student?.scheduledMeetings?.length ?? 0) -
      (completedSessions?.length ?? 0),
  };

  // Mock data for session tracking
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const sessionData = months.map((month) => {
    const count =
      completedSessions?.filter((m) => m.formatedDate.includes(month)).length ??
      0;
    return { month, count };
  });

  // console.log("sessionData", sessionData);

  return (
    <div className="container mx-auto w-full px-4 py-6">
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
        <YourMentors mentors={mentorsData!} />
      </div>
    </div>
  );
};

export default StudentDashboardPage;
