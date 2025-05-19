// context.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import { CompanyType } from "./types";

interface ProfileContextType {
  avatar: string | null;
  name: string;
  currentCompany: string;
  jobTitle: string;
  experience: string;
  industry: string;
  state: string;
  bio: string;
  hiringFields: string[];
  skills: string[];
  linkedinUrl: string;
  companyType: string;
  updateAvatar: (url: string) => void;
  updateProfileField: (field: string, value: string | string[]) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{
  children: React.ReactNode;
  initialData?: Partial<ProfileContextType>;
}> = ({ children, initialData = {} }) => {
  const [avatar, setAvatar] = useState<string | null>(initialData.avatar || null);
  const [name, setName] = useState(initialData.name || "");
  const [currentCompany, setCurrentCompany] = useState(initialData.currentCompany || "");
  const [jobTitle, setJobTitle] = useState(initialData.jobTitle || "");
  const [experience, setExperience] = useState(initialData.experience || "");
  const [industry, setIndustry] = useState(initialData.industry || "");
  const [state, setState] = useState(initialData.state || "");
  const [bio, setBio] = useState(initialData.bio || "");
  const [hiringFields, setHiringFields] = useState<string[]>(initialData.hiringFields || []);
  const [skills, setSkills] = useState<string[]>(initialData.skills || []);
  const [linkedinUrl, setLinkedinUrl] = useState(initialData.linkedinUrl || "");
  const [companyType, setCompanyType] = useState(initialData.companyType || CompanyType.STARTUP);

  const updateAvatar = (url: string) => {
    setAvatar(url);
  };

  const updateProfileField = (field: string, value: string | string[]) => {
    switch (field) {
      case "name":
        setName(value as string);
        break;
      case "currentCompany":
        setCurrentCompany(value as string);
        break;
      case "jobTitle":
        setJobTitle(value as string);
        break;
      case "experience":
        setExperience(value as string);
        break;
      case "industry":
        setIndustry(value as string);
        break;
      case "state":
        setState(value as string);
        break;
      case "bio":
        setBio(value as string);
        break;
      case "hiringFields":
        setHiringFields(value as string[]);
        break;
      case "skills":
        setSkills(value as string[]);
        break;
      case "linkedinUrl":
        setLinkedinUrl(value as string);
        break;
      case "companyType":
        setCompanyType(value as string);
        break;
      default:
        console.warn(`Unknown field: ${field}`);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        avatar,
        name,
        currentCompany,
        jobTitle,
        experience,
        industry,
        state,
        bio,
        hiringFields,
        skills,
        linkedinUrl,
        companyType,
        updateAvatar,
        updateProfileField,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};