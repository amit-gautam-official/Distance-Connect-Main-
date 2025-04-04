"use client";

import React, { createContext, useContext } from "react";

// Create a context for sharing profile state
export interface ProfileContextType {
  avatarUrl: string;
  updateAvatar: (newUrl: string) => void;
  profileData: {
    name: string;
    state: string;
    interestFields: string[];
    institutionName: string;
    courseSpecialization: string;
    companyName: string;
    jobTitle: string;
    experience: string;
    industry: string;
    studentRole: string;
  };
  updateProfileField: (field: string, value: any) => void;
}

export const ProfileContext = createContext<ProfileContextType>({
  avatarUrl: "",
  updateAvatar: (newUrl: string) => {
    console.log("Avatar update not implemented in context consumer", newUrl);
  },
  profileData: {
    name: "",
    state: "",
    interestFields: [],
    institutionName: "",
    courseSpecialization: "",
    companyName: "",
    jobTitle: "",
    experience: "",
    industry: "",
    studentRole: "",
  },
  updateProfileField: (field: string, value: any) => {
    console.log(
      "Profile field update not implemented in context consumer",
      field,
      value,
    );
  },
});

// Export the hook to use the profile context
export const useProfile = () => useContext(ProfileContext);
