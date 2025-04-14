// components/ProfileCompletionBar.tsx
import React, { useMemo, useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { CompanyType, Education, Experience } from "./types";
import { User as PrismaUser, Mentor } from "@prisma/client";

interface ProfileCompletionBarProps {
  user: PrismaUser;
  mentor: Mentor;
  formData: {
    name: string;
    location: string;
    linkedinUrl: string | undefined;
    currentCompany: string;
    pinCode: string;
    state: string;
    hiringFields: string;
    skills: string;
    jobTitle: string;
    experience: string;
    industry: string;
    bio: string;
  };
  educationList: Education[];
  experienceList: Experience[];
}

interface SectionCompletion {
  name: string;
  isComplete: boolean;
  fields: {
    name: string;
    isComplete: boolean;
  }[];
}

const ProfileCompletionBar: React.FC<ProfileCompletionBarProps> = ({
  user,
  mentor,
  formData,
  educationList,
  experienceList,
}) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const { completionPercentage, sections } = useMemo(() => {
    // Define sections and their fields to check
    const sectionsToCheck: SectionCompletion[] = [
      {
        name: "Basic Info",
        isComplete: false,
        fields: [
          { name: "Profile Picture", isComplete: !!user.avatarUrl },
          { name: "Name", isComplete: !!formData.name },
          { name: "Bio", isComplete: !!formData.bio && formData.bio.length >= 50 },
          { name: "LinkedIn Profile", isComplete: !!formData.linkedinUrl },
          { name: "Location", isComplete: !!formData.location },
          { name: "Pin Code", isComplete: !!formData.pinCode },
          { name: "Company Type", isComplete: !!mentor.companyType },
          { name: "Current Company", isComplete: !!formData.currentCompany },
          { name: "Job Title", isComplete: !!formData.jobTitle },
          { name: "Experience Level" , isComplete: !!formData.experience },
          { name: "Industry", isComplete: !!formData.industry },
          { name: "Profile Banner", isComplete: !!mentor.profileBanner },
        ],
      },
      {
        name: "Professional Details",
        isComplete: false,
        fields: [
          { name: "Company Name", isComplete: !!formData.currentCompany },
          { name: "Job Title", isComplete: !!formData.jobTitle },
          { name: "Experience", isComplete: !!formData.experience },
          { name: "Industry", isComplete: !!formData.industry  },
        ],
      },
      {
        name: "Education",
        isComplete: false,
        fields: [
          { name: "Education History", isComplete: educationList.length === 1 ? educationList[0]?.institution !== "" : educationList.length > 1 },
        ],
      },
      {
        name: "Experience",
        isComplete: false,
        fields: [
          { name: "Work Experience", isComplete: experienceList.length === 1 ? experienceList[0]?.company !== "" : experienceList.length > 1 },
        ],
      },
      {
        name: "Skills & Expertise",
        isComplete: false,
        fields: [
          { name: "Skills", isComplete: !!formData.skills && formData.skills.split(",").length >= 3 },
          { name: "Hiring Fields", isComplete: !!formData.hiringFields },
        ],
      },
      {
        name: "Verification",
        isComplete: false,
        fields: [
          { name: "Company Email", isComplete: !!mentor.companyEmail },
        ],
      },
    ];

    // Calculate completion for each section
    const updatedSections = sectionsToCheck.map(section => {
      const completedFields = section.fields.filter(field => field.isComplete).length;
      const sectionCompletion = {
        ...section,
        isComplete: completedFields === section.fields.length,
        completedFields,
        totalFields: section.fields.length,
        percentage: Math.round((completedFields / section.fields.length) * 100),
      };
      return sectionCompletion;
    });

    // Calculate overall completion percentage
    const totalFields = updatedSections.reduce((sum, section) => sum + section.totalFields, 0);
    const completedFields = updatedSections.reduce((sum, section) => sum + section.completedFields, 0);
    const percentage = Math.round((completedFields / totalFields) * 100);

    return {
      completionPercentage: percentage,
      sections: updatedSections,
    };
  }, [user, mentor, formData, educationList, experienceList]);

  return (
    <div className="mb-6 bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h3 className="text-lg font-medium">Profile Completion</h3>
          <p className="text-sm text-gray-500">
            Complete your profile to increase visibility to potential mentees
          </p>
        </div>
        <div className="mt-2 md:mt-0 flex items-center">
          <span className="text-2xl font-bold">{completionPercentage}%</span>
          <span className="ml-2 text-sm text-gray-500">Complete</span>
        </div>
      </div>

      <Progress value={completionPercentage} className="h-2 mb-4" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {sections.map((section) => (
          <div 
            key={section.name} 
            className={`p-3 rounded-md border ${
              section.isComplete ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm">{section.name}</h4>
              {section.isComplete ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <div className="relative">
                  <div 
                    className="cursor-help"
                    onMouseEnter={() => setHoveredSection(section.name)}
                    onMouseLeave={() => setHoveredSection(null)}
                  >
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  </div>
                  
                  {hoveredSection === section.name && (
                    <div className="absolute right-0 z-10 w-48 p-2 mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                      <p className="text-xs font-medium mb-1 text-gray-700">Missing fields:</p>
                      <ul className="text-xs text-gray-600">
                        {section.fields
                          .filter(field => !field.isComplete)
                          .map(field => (
                            <li key={field.name} className="flex items-center py-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                              {field.name}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Progress value={section.percentage} className="h-1 flex-1 mr-2" />
              <span className="text-xs font-medium">
                {section.completedFields}/{section.totalFields}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {completionPercentage < 100 && (
        <p className="text-sm text-amber-600 mt-4 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          Complete your profile to improve your visibility to potential mentees
        </p>
      )}
    </div>
  );
};

export default ProfileCompletionBar;