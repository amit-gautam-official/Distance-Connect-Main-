import React from "react";
import { api } from "@/trpc/server";
import { cache } from "react";
// Components
import ExploreMentorsBanner from "./components/ExploreMentorsBanner";
import DashboardStats from "./components/DashboardStats";
import TrackSessions from "./components/TrackSessions";
import YourMentors from "./components/YourMentors";

const StudentDashboardPage = async () => {
  const student = await api.student.getStudent();

  const currentTimestamp = new Date().getTime();

  const filterMeetingList = cache((type: string) => {
    if (type === "upcoming") {
      return student?.scheduledMeetings.filter(
        (item) =>
          Number(item?.formatedTimeStamp) >= Number(currentTimestamp) &&
          !item?.completed,
      );
    } else if (type === "completed") {
      return student?.scheduledMeetings.filter((item) => item?.completed);
    } else if (type === "missed") {
      return student?.scheduledMeetings.filter(
        (item) =>
          Number(item?.formatedTimeStamp) < Number(currentTimestamp) &&
          !item?.completed,
      );
    }
  });

  const mentorsData = filterMeetingList("upcoming")?.map((meeting) => ({
    id: meeting.mentor.id ?? "",
    mentorUserId: meeting.mentor.userId ?? "",
    name: meeting.mentor.user.name ?? "",
    role: meeting.mentor.user.role ?? "",
    company: meeting.mentor.currentCompany ?? "",
    expertise: meeting.mentor.hiringFields ?? [],
    image: meeting.mentor.user.image ?? "",
    isFollowing: false,
    rating: 4,
    selectedTime: meeting.selectedTime ?? "",
    formatedDate: meeting.formatedDate ?? "",
    formatedTimeStamp: meeting.formatedTimeStamp ?? "",
    duration: meeting.duration ?? 0,
    meetUrl: meeting.meetUrl ?? "",
    eventName: meeting.eventName ?? "",
    userNote: meeting.userNote ?? "",
  }));

  const completedSessions = filterMeetingList("completed");

  const stats = {
    sessionsCompleted: completedSessions?.length ?? 0,
    sessionsCompletedTrend: "8.5%",
    totalTimeSpent:
      completedSessions?.reduce((acc, curr) => acc + curr.duration, 0) ?? 0,
    totalTimeSpentTrend: "4.3%",
    totalPending: (student?.scheduledMeetings?.length ?? 0) - (completedSessions?.length ?? 0),
  }

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

  if(!mentorsData || !sessionData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto w-full px-4 py-6 ">
      <ExploreMentorsBanner />
      <div className="mt-6">
        <DashboardStats stats={stats} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 md:mb-0 mb-20">
        <TrackSessions sessionData={sessionData} />
        <YourMentors mentors={mentorsData} />
      </div>
    </div>
  );
};

export default StudentDashboardPage;
