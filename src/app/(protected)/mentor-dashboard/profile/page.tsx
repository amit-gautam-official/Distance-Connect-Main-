"use client";

import React, { useState, useEffect } from "react";
import { MainContentSkeleton, ProfileHeaderSkeleton, ProfileSkeleton } from "./components/ProfileSkeleton";
import ProfileHeader from "./components/ProfileHeader";
import UserSettings from "./components/UserSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/react";
import Link from "next/link";
import { ProfileContext } from "./context";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

interface MentorData {
  id: string;
  mentorPhoneNumber: string;
  mentorName: string;
  currentCompany: string;
  jobTitle: string;
  experience: string;
  industry: string;
  hiringFields: string[];
  companyType: string;
  state: string;
  pinCode: number;
  bio: string;
  education: JSON[];
  wholeExperience: JSON[];
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
    role: string;
    createdAt: Date;
  };
  companyEmail: string | null;
}

const TOUR_STORAGE_KEY = "profile-tour-shown";

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
    bio: "",
    education: [] as JSON[],
    wholeExperience: [] as JSON[],
    companyEmail: "",
    phoneNumber: "",
  });

  // Initialize data from mentor data when it loads
  useEffect(() => {
    if (mentor) {
      if (mentor.user?.image) {
        setCurrentAvatarUrl(mentor.user.image);
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
        bio: mentor.bio || "",
        education: mentor.education || [] as JSON[],
        wholeExperience: mentor.wholeExperience || [] as JSON[],
        companyEmail: mentor.companyEmail || "",
        phoneNumber: mentor.mentorPhoneNumber || "",
      });
    }
  }, [mentor]);

  const updateProfileField = (field: string, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };



  // Function to start the tour
  const startTour = () => {
    if (typeof window === "undefined") return;

    const driverObj = driver({
      showProgress: true,
      steps: [  
    {
      element: '#profile-settings',
      popover: {
        title: 'Update Profile',
        description: 'Update your personal and professional information here. Make sure to update your experience so that you profile can be verified.',
        side: "right",  
        align: 'start',
      }
    },
    {
      element: '#availability',
      popover: {
        title: 'Update Availability',
        description: 'Set your availability for mentoring sessions. This helps mentees know when you are available to meet.',
        side: "right",  
        align: 'start',
      }
    },
  ],

    });

    driverObj.drive();
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
  };

  // Run tour only once on initial load if not done before
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasRunTour = localStorage.getItem(TOUR_STORAGE_KEY ) === "true";
    if (!isLoading && !hasRunTour) {
      const el = document.querySelector("#profile-header");
      if (el) {
      setTimeout(() => {
        startTour();
      }, 500);
      }

    }
  }, [isLoading]);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  const profileHeaderData = {
    phoneNumber: mentor?.mentorPhoneNumber || "",
    name: profileData.name || mentor?.user?.name || "",
    email: mentor?.user?.email || "",
    image: currentAvatarUrl || mentor?.user?.image || "",
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
    bio: mentor?.bio || "",
    education: mentor?.education || [] as JSON[],
    wholeExperience: mentor?.wholeExperience || [] as JSON[],
    commanyEmail: mentor?.companyEmail || "",
  };

  return (
    <ProfileContext.Provider
      value={{
        image: currentAvatarUrl || mentor?.user?.image || "",
        updateAvatar: setCurrentAvatarUrl,
        profileData,
        updateProfileField,
      }}
    >
      <div className="container mx-auto px-2 py-4 sm:py-6">


        <div className="grid grid-cols-1 justify-center gap-4 lg:grid-cols-3 md:gap-6 lg:gap-8">
          {/* Mobile-only profile header visibility control */}
          <div className="block lg:hidden mb-4 ">
            <div className="rounded-lg bg-card p-4 shadow-sm">
              <ProfileHeader user={profileHeaderData!} />
            </div>
          </div>

          {/* Layout for larger screens */}
          <div  className="hidden lg:block lg:col-span-1 ">
            <div className="sticky no-scrollbar top-4 overflow-auto max-h-[calc(100vh-2rem)]">
              <div className="rounded-lg bg-card p-4 shadow-sm sm:p-6">
                <ProfileHeader user={profileHeaderData!} />
              </div>
            </div>
          </div>

          {/* Main Content - Scrollable */}
          <div className="col-span-1 lg:col-span-2 space-y-4 ">
            <div className="rounded-lg bg-card p-3 sm:p-6 min-h-[500px] overflow-y-auto">
              <UserSettings />
            </div>
          </div>
        </div>
      </div>
    </ProfileContext.Provider>
  );
};

export default ProfilePage;
