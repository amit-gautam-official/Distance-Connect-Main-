// ProfileSettings.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/trpc/react";
import { useProfile } from "../context";
import { User as PrismaUser, Mentor } from "@prisma/client";
import { CompanyType, Education, Experience } from "./types";
import ProfileCompletionBar from "./ProfileCompletionBar";

// Import components for each tab
import BasicInfoTab from "./tabs/BasicInfoTab";
import EducationTab from "./tabs/EducationTab";
import ExperienceTab from "./tabs/ExperienceTab";
import SkillsTab from "./tabs/SkillsTab";
import AccountSecurityTab from "./tabs/AccountSecurityTab";
import CompanyEmail from "./CompanyEmail";

interface ProfileSettingsProps {
  user: PrismaUser;
  mentor: Mentor;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, mentor }) => {
  const router = useRouter();
  const { updateAvatar, updateProfileField } = useProfile();
  const [activeTab, setActiveTab] = useState("basic-info");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use empty default values for initial server render to avoid hydration mismatch
  const [companyType, setCompanyType] = useState<CompanyType>(
    CompanyType.STARTUP
  );
  
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    linkedinUrl: "",
    currentCompany: "",
    pinCode: "",
    state: "",
    hiringFields: "",
    skills: "",
    jobTitle: "",
    experience: "",
    industry: "",
    bio: "",
  });

  // Initialize education and experience data
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [experienceList, setExperienceList] = useState<Experience[]>([]);

  const updateUserMutation = api.user.updateUser.useMutation({
    onSuccess: () => {
      setIsSubmitting(false);
    },
    onError: (error) => {
      const fieldErrors = error?.data?.zodError?.fieldErrors;
      const firstErrorMessage = fieldErrors
        ? Object.values(fieldErrors)[0]?.[0]
        : "Something went wrong";
      toast.error(firstErrorMessage || "Failed to update user");      
      setIsSubmitting(false);
    },
  });
  
  const updateMentorMutation = api.mentor.updateMentor.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully");
      router.refresh();
      setIsSubmitting(false);
    },
    onError: (error) => {
      const fieldErrors = error?.data?.zodError?.fieldErrors;
      const firstErrorMessage = fieldErrors
        ? Object.values(fieldErrors)[0]?.[0]
        : "Something went wrong";
      toast.error(firstErrorMessage || "Failed to update mentor");
    },
  });

  // Initialize state with user data after component mounts (client-side only)
  useEffect(() => {
    if (user && mentor) {
      setCompanyType((mentor?.companyType as CompanyType) || CompanyType.STARTUP);
      setFormData({
        name: user?.name || "",
        location: mentor?.state || "",
        linkedinUrl: mentor?.linkedinUrl || "",
        currentCompany: mentor?.currentCompany || "",
        pinCode: mentor?.pinCode?.toString() || "",
        state: mentor?.state || "",
        skills: Array.isArray(mentor?.skills)
          ? mentor?.skills.join(", ")
          : "",
        hiringFields: Array.isArray(mentor?.hiringFields)
          ? mentor?.hiringFields.join(", ")
          : "",
        jobTitle: mentor?.jobTitle || "",
        experience: mentor?.experience || "",
        industry: mentor?.industry || "",
        bio: mentor?.bio || "",
      });

      // Parse education JSON data if available
      if (mentor?.education) {
        try {
          const parsedEducation = typeof mentor.education === 'string' 
            ? JSON.parse(mentor.education) 
            : mentor.education;
          setEducationList(Array.isArray(parsedEducation) ? parsedEducation : []);
        } catch (error) {
          console.error("Failed to parse education data:", error);
          setEducationList([]);
        }
      }

      // Parse experience JSON data if available
      if (mentor?.wholeExperience) {
        try {
          const parsedExperience = typeof mentor.wholeExperience === 'string'
            ? JSON.parse(mentor.wholeExperience)
            : mentor.wholeExperience;
          setExperienceList(Array.isArray(parsedExperience) ? parsedExperience : []);
        } catch (error) {
          console.error("Failed to parse experience data:", error);
          setExperienceList([]);
        }
      }
    }
  }, [user, mentor]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Update context state for immediate UI updates
    if (name === "name") {
      updateProfileField("name", value);
    } else if (name === "currentCompany") {
      updateProfileField("currentCompany", value);
    } else if (name === "jobTitle") {
      updateProfileField("jobTitle", value);
    } else if (name === "experience") {
      updateProfileField("experience", value);
    } else if (name === "industry") {
      updateProfileField("industry", value);
    } else if (name === "state") {
      updateProfileField("state", value);
    } else if (name === "bio") {
      updateProfileField("bio", value);
    } else if (name === "hiringFields") {
      // Split by comma and trim spaces for array fields
      const fields = value.split(",").map((field) => field.trim());
      updateProfileField("hiringFields", fields);
    }
    else if (name === "linkedinUrl") {
      updateProfileField("linkedinUrl", value);
    } 
    else if (name === "skills") {
      // Split by comma and trim spaces for array fields
      const fields = value.split(",").map((field) => field.trim());
      updateProfileField("skills", fields);
    }
  };

  const handleCompanyTypeChange = (value: string) => {
    setCompanyType(value as CompanyType);
    updateProfileField("companyType", value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    updateUserMutation.mutate({
      name: formData.name,
    });

    updateMentorMutation.mutate({
      companyType,
      currentCompany: formData.currentCompany,
      pinCode: parseInt(formData.pinCode || "0"),
      hiringFields: formData.hiringFields.split(",").map(item => item.trim()),
      skills: formData.skills.split(",").map(item => item.trim()),
      state: formData.state,
      linkedinUrl: formData.linkedinUrl === "" ? undefined : formData.linkedinUrl,
      jobTitle: formData.jobTitle,
      experience: formData.experience,
      industry: formData.industry,
      mentorName: formData.name,
      bio: formData.bio,
      education: educationList,
      wholeExperience: experienceList,
    });
  };

  return (
    <div className="space-y-6 py-4">
      {/* Profile Completion Progress Bar */}
      <ProfileCompletionBar 
        user={user}
        mentor={mentor}
        formData={formData}
        educationList={educationList}
        experienceList={experienceList}
      />
      
      <Card>
        <CardHeader className="px-6 pt-6 pb-0">
          {/* Empty header to maintain spacing */}
        </CardHeader>
        <CardContent className="px-6 pt-2">
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid text-xs w-full grid-cols-3 items-center gap-3 md:grid-cols-6">
                <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="verifyEmail">Verification</TabsTrigger>
              </TabsList>

              <TabsContent value="basic-info" className="mt-12 md:mt-6 w-full ">
                <BasicInfoTab 
                  formData={formData}
                  companyType={companyType}
                  handleChange={handleChange}
                  handleCompanyTypeChange={handleCompanyTypeChange}
                  user={user}
                  mentor={mentor}
                  updateAvatar={updateAvatar}
                  isSubmitting={isSubmitting}
                />
              </TabsContent>

              <TabsContent value="education" className="mt-12 md:mt-6">
                <EducationTab 
                  educationList={educationList}
                  setEducationList={setEducationList}
                />
              </TabsContent>

              <TabsContent value="experience" className="mt-12 md:mt-6">
                <ExperienceTab 
                  experienceList={experienceList}
                  setExperienceList={setExperienceList}
                />
              </TabsContent>

              <TabsContent value="skills" className="mt-12 md:mt-6">
                <SkillsTab 
                  formData={formData}
                  handleChange={handleChange}
                />
              </TabsContent>

              <TabsContent value="account" className="mt-12 md:mt-6">
                <AccountSecurityTab />
              </TabsContent>
              <TabsContent value="verifyEmail" className="mt-12 md:mt-6">
                <CompanyEmail
                  companyEmailVerified={mentor.companyEmailVerified}
                  company={formData.currentCompany}
                  companyEmail={mentor.companyEmail || ""}
                />
              </TabsContent>
            </Tabs>

            {
              activeTab !== "verifyEmail" && (
                <div className="mt-6 flex justify-end">
                  <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save All Changes"
                    )}
                  </Button>
                </div>
              )
            }
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;