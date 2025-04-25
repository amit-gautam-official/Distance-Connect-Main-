"use client";

import React, { useState } from "react";
import ProfileHeader from "./components/ProfileHeader";
import MentorList from "./components/MentorList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserSettings from "./components/UserSettings";
import { api } from "@/trpc/react";
import { ProfileContext } from "./context";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("mentors");
  const { data: student } = api.student.getStudent.useQuery(undefined, {
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

  const userSettingsData = {
    name: profileData.name || student?.studentName || "",
    email: student?.user.email || "",
    image: currentAvatarUrl || student?.user.image || "",
    role: student?.user.role || "",
    state: profileData.state || student?.state || "",
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
      <div className="container mx-auto px-2 py-4 sm:py-6 ">
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

              {/* Use a fixed height container for tab content */}
              <div className="min-h-[500px] sm:min-h-[600px]">
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
