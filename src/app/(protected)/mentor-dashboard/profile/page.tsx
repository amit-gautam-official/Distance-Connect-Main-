"use client";

import React, { useState } from "react";
import ProfileHeader from "./components/ProfileHeader";
import StudentList from "./components/StudentList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserSettings from "./components/UserSettings";
import { api } from "@/trpc/react";

// Define proper type for mentor data
interface MentorData {
  id: string;
  mentorName: string;
  currentCompany: string;
  jobTitle: string;
  experience: string;
  industry: string;
  hiringFields: string[];
  companyType: string;
  state: string;
  pinCode: number;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    role: string;
    createdAt: Date;
  };
  scheduledMeetings: Array<{
    id: string;
    student: {
      id: string;
      userId: string;
      studentName: string;
      institutionName: string;
      interestFields: string[];
      user: {
        name: string;
        avatarUrl: string;
        role: string;
      };
    };
  }>;
}

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("students");
  const { data: mentor } = api.mentor.getMentorDataById.useQuery(
    undefined,
    {
      // Reduce retries to avoid rate limit issues
      retry: 1,
      // Increase staleTime to reduce refetches
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  ) as { data: MentorData | undefined };

  const studentsData = Array.from(
    new Set(
      mentor?.scheduledMeetings?.map((meeting) => meeting.student.id) || [],
    ),
  ).map((studentId) => {
    const meeting = mentor?.scheduledMeetings?.find(
      (m) => m.student.id === studentId,
    );
    return {
      id: meeting?.student.id ?? "",
      studentUserId: meeting?.student.userId ?? "",
      name: meeting?.student.user.name ?? "",
      role: meeting?.student.user.role ?? "",
      instituteName: meeting?.student.institutionName ?? "",
      expertise: meeting?.student.interestFields ?? [],
      avatarUrl: meeting?.student.user.avatarUrl ?? "",
      isFollowing: false,
      rating: 4,
    };
  });

  const profileHeaderData = {
    name: mentor?.mentorName ?? "",
    email: mentor?.user?.email ?? "",
    avatarUrl: mentor?.user?.avatarUrl ?? "",
    role: mentor?.user?.role ?? "",
    state: mentor?.state ?? "",
    createdAt: mentor?.user?.createdAt!,
    hiringFields: mentor?.hiringFields ?? [],
    currentCompany: mentor?.currentCompany ?? "",
    pinCode: mentor?.pinCode?.toString() ?? "",
    jobTitle: mentor?.jobTitle ?? "",
    experience: mentor?.experience ?? "",
    industry: mentor?.industry ?? "",
    companyType: mentor?.companyType ?? "",
  };

  const userSettingsData = {
    name: mentor?.mentorName ?? "",
    email: mentor?.user?.email ?? "",
    avatarUrl: mentor?.user?.avatarUrl ?? "",
    role: mentor?.user?.role ?? "",
    state: mentor?.state ?? "",
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 lg:gap-8">
        {/* Profile Header - Takes full width on mobile, 1/3 on desktop */}
        <div className="col-span-1 md:sticky md:top-20 md:self-start">
          <div className="rounded-lg border bg-card p-4 shadow-sm sm:p-6">
            <ProfileHeader user={profileHeaderData!} />
          </div>
        </div>

        {/* Main Content - Takes full width on mobile, 2/3 on desktop */}
        <div className="col-span-1 space-y-4 md:col-span-2 md:space-y-6">
          <Tabs
            defaultValue="students"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="students" className="text-sm sm:text-base">
                My Students
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-sm sm:text-base">
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Use a fixed height container for tab content */}
            <div className="min-h-[500px] sm:min-h-[600px]">
              <TabsContent value="students" className="mt-4 sm:mt-6">
                <StudentList studentsData={studentsData!} />
              </TabsContent>

              <TabsContent value="settings" className="mt-4 sm:mt-6">
                <UserSettings />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
