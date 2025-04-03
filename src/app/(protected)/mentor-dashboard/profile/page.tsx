"use client";

import React, { useState, createContext, useContext } from "react";
import ProfileHeader from "./components/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserSettings from "./components/UserSettings";
import { api } from "@/trpc/react";
import ProfileSkeleton from "./components/ProfileSkeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
}

// Create a context for sharing profile state
interface ProfileContextType {
  avatarUrl: string;
  updateAvatar: (newUrl: string) => void;
  profileData: {
    name: string;
    currentCompany: string;
    jobTitle: string;
    experience: string;
    industry: string;
    hiringFields: string[];
    state: string;
    companyType: string;
  };
  updateProfileField: (field: string, value: any) => void;
}

const ProfileContext = createContext<ProfileContextType>({
  avatarUrl: "",
  updateAvatar: () => {},
  profileData: {
    name: "",
    currentCompany: "",
    jobTitle: "",
    experience: "",
    industry: "",
    hiringFields: [],
    state: "",
    companyType: "",
  },
  updateProfileField: () => {},
});

export const useProfile = () => useContext(ProfileContext);

const ProfilePage = () => {
  const { data: mentor, isLoading } = api.mentor.getMentorDataById.useQuery(
    undefined,
    {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  ) as { data: MentorData | undefined; isLoading: boolean };

  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string>("");
  const [profileData, setProfileData] = useState({
    name: "",
    currentCompany: "",
    jobTitle: "",
    experience: "",
    industry: "",
    hiringFields: [] as string[],
    state: "",
    companyType: "",
  });

  // Initialize data from mentor data when it loads
  React.useEffect(() => {
    if (mentor) {
      if (mentor.user?.avatarUrl) {
        setCurrentAvatarUrl(mentor.user.avatarUrl);
      }

      setProfileData({
        name: mentor.user?.name || "",
        currentCompany: mentor.currentCompany || "",
        jobTitle: mentor.jobTitle || "",
        experience: mentor.experience || "",
        industry: mentor.industry || "",
        hiringFields: mentor.hiringFields || [],
        state: mentor.state || "",
        companyType: mentor.companyType || "",
      });
    }
  }, [mentor]);

  const updateProfileField = (field: string, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  const profileHeaderData = {
    name: profileData.name || mentor?.user?.name || "",
    email: mentor?.user?.email || "",
    avatarUrl: currentAvatarUrl || mentor?.user?.avatarUrl || "",
    role: mentor?.user?.role || "",
    state: profileData.state || mentor?.state || "",
    createdAt: mentor?.user?.createdAt!,
    hiringFields: profileData.hiringFields || mentor?.hiringFields || [],
    currentCompany: profileData.currentCompany || mentor?.currentCompany || "",
    pinCode: mentor?.pinCode?.toString() || "",
    jobTitle: profileData.jobTitle || mentor?.jobTitle || "",
    experience: profileData.experience || mentor?.experience || "",
    industry: profileData.industry || mentor?.industry || "",
    companyType: profileData.companyType || mentor?.companyType || "",
    userId: mentor?.user?.id || "",
  };

  return (
    <ProfileContext.Provider
      value={{
        avatarUrl: currentAvatarUrl || mentor?.user?.avatarUrl || "",
        updateAvatar: setCurrentAvatarUrl,
        profileData,
        updateProfileField,
      }}
    >
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
            <div className="min-h-[500px] sm:min-h-[600px]">
              <UserSettings />
            </div>
          </div>
        </div>
      </div>
    </ProfileContext.Provider>
  );
};

export default ProfilePage;
