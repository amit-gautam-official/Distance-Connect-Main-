// UserSettings.tsx - Main Component
"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Calendar } from "lucide-react";
import { api } from "@/trpc/react";
import ProfileSettings from "./ProfileSettings";
import AvailabilitySettings from "./AvailabilitySettings";

const UserSettings = () => {
  const { data: user, isLoading } = api.user.getMe.useQuery(undefined, {
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  const { data: mentor } = api.mentor.getMentorDataById.useQuery(undefined, {
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !mentor) {
    return <div>No user or mentor data found</div>;
  }

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger id="profile-settings" value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Profile Settings
        </TabsTrigger>
        <TabsTrigger id="availability" value="availability" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Availability
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <ProfileSettings user={user} mentor={mentor} />
      </TabsContent>
      <TabsContent value="availability">
        <AvailabilitySettings />
      </TabsContent>
    </Tabs>
  );
};

export default UserSettings;