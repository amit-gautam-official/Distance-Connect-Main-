"use client";

import React, { useState } from "react";
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

const ProfilePage = () => {
  const { data: mentor, isLoading } = api.mentor.getMentorDataById.useQuery(
    undefined,
    {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  ) as { data: MentorData | undefined; isLoading: boolean };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  const profileHeaderData = {
    name: mentor?.user?.name ?? "",
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
    userId: mentor?.user?.id ?? "",
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
          <div className="min-h-[500px] sm:min-h-[600px]">
            <UserSettings />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
