"use client";

import React, { createContext, useContext } from "react";

// Create a context for sharing profile state
export interface ProfileContextType {
  image: string;
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
    phoneNumber?: string; // Optional field for phone number
  };
  updateProfileField: (field: string, value: any) => void;
}

export const ProfileContext = createContext<ProfileContextType>({
  image: "",
  updateAvatar: (newUrl: string) => {
    // console.log("Avatar update not implemented in context consumer", newUrl);
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
    phoneNumber: "", // Default to empty string if not provided
  },
  updateProfileField: (field: string, value: any) => {
    // console.log(
    //   "Profile field update not implemented in context consumer",
    //   field,
    //   value,
    // );
  },
});

// Export the hook to use the profile context
export const useProfile = () => useContext(ProfileContext);
