"use client";

import React, { useState, useEffect } from "react";
import { ProfileSkeleton, ProfileHeaderSkeleton, MainContentSkeleton } from "./components/ProfileSkeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/react";
import { ProfileContext } from "./context";
import dynamic from "next/dynamic";

// Dynamic imports with loading skeletons
const ProfileHeader = dynamic(() => import("./components/ProfileHeader"), {
  loading: () => <ProfileHeaderSkeleton />,
  ssr: false,
});

const MentorList = dynamic(() => import("./components/MentorList"), {
  loading: () => <MainContentSkeleton />,
  ssr: false,
});

const UserSettings = dynamic(() => import("./components/UserSettings"), {
  loading: () => <MainContentSkeleton />,
  ssr: false,
});

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("mentors");
  const { data: student, isLoading } = api.student.getStudent.useQuery(undefined, {
    // Reduce retries to avoid rate limit issues
    retry: 1,
    // Increase staleTime to reduce refetches
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string>("");
  const [profileData, setProfileData] = useState({
    name: "",
    state: "",
    interestFields: [] as string[],
    institutionName: "",
    courseSpecialization: "",
    companyName: "",
    jobTitle: "",
    experience: "",
    industry: "",
    studentRole: "",
  });

  // Initialize avatar URL from student data when it loads
  React.useEffect(() => {
    if (student) {
      if (student.user.image) {
        setCurrentAvatarUrl(student.user.image);
      }

      setProfileData({
        name: student.studentName || "",
        state: student.state || "",
        interestFields: student.interestFields || [],
        institutionName: student.institutionName || "",
        courseSpecialization: student.courseSpecialization || "",
        companyName: student.companyName || "",
        jobTitle: student.jobTitle || "",
        experience: student.experience || "",
        industry: student.industry || "",
        studentRole: student.studentRole || "",
      });
    }
  }, [student]);

  const updateProfileField = (field: string, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Show loading skeleton when data is loading
  if (isLoading) {
    return <ProfileSkeleton />;
  }

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
      image: meeting?.mentor.user.image ?? "",
      isFollowing: false,
      rating: 4,
    };
  });

  const profileHeaderData = {
    name: profileData.name || student?.studentName || "",
    email: student?.user.email || "",
    image: currentAvatarUrl || student?.user.image || "",
    role: student?.user.role || "",
    state: profileData.state || student?.state || "",
    createdAt: student?.user.createdAt!,
    interestFields: profileData.interestFields || student?.interestFields || [],
    instituteName:
      profileData.institutionName || student?.institutionName || "",
    pinCode: student?.pinCode?.toString() || "",
    courseSpecialization:
      profileData.courseSpecialization || student?.courseSpecialization || "",
    companyName: profileData.companyName || student?.companyName || "",
    jobTitle: profileData.jobTitle || student?.jobTitle || "",
    experience: profileData.experience || student?.experience || "",
    industry: profileData.industry || student?.industry || "",
    studentRole: profileData.studentRole || student?.studentRole || "",
  };

  return (
    <ProfileContext.Provider
      value={{
        image: currentAvatarUrl || student?.user.image || "",
        updateAvatar: setCurrentAvatarUrl,
        profileData,
        updateProfileField,
      }}
    >
      <div className="container mx-auto px-2 py-4 sm:py-6">
        <div className="grid grid-cols-1 justify-center gap-4 lg:grid-cols-3 md:gap-6 lg:gap-8">
          {/* Mobile-only profile header visibility control */}
          <div className="block lg:hidden mb-4">
            <div className="rounded-lg bg-card border p-4 shadow-sm">
              <ProfileHeader user={profileHeaderData!} />
            </div>
          </div>
          
          {/* Layout for larger screens */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-4 overflow-auto max-h-[calc(100vh-2rem)]">
              <div className="rounded-lg bg-card border p-4 shadow-sm sm:p-6">
                <ProfileHeader user={profileHeaderData!} />
              </div>
            </div>
          </div>

          {/* Main Content - Scrollable */}
          <div className="col-span-1 lg:col-span-2 space-y-4">
            <Tabs
              defaultValue="mentors"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="mentors" className="text-sm sm:text-base">
                  My Mentors
                </TabsTrigger>
                <TabsTrigger value="settings" className="text-sm sm:text-base">
                  Settings
                </TabsTrigger>
              </TabsList>

              {/* Scrollable tab content */}
              <div className="overflow-y-auto max-h-[calc(100vh-10rem)]">
                <TabsContent value="mentors" className="mt-4 sm:mt-6">
                  <MentorList mentorsData={mentorsData!} />
                </TabsContent>

                <TabsContent value="settings" className="mt-4 sm:mt-6">
                  <UserSettings />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </ProfileContext.Provider>
  );
};

export default ProfilePage;