"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Briefcase,
  Calendar,
  Mail,
  Building,
  CircleDollarSign,
  Clock,
  FileText,
  GraduationCap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { api } from "@/trpc/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Define interfaces for Education and Experience
interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

interface ProfileHeaderProps {
  name: string;
  email: string;
  image: string;
  role: string;
  state: string;
  createdAt: Date;
  hiringFields: string[];
  currentCompany: string;
  // Additional optional fields
  pinCode?: string;
  jobTitle?: string;
  experience?: string;
  industry?: string;
  companyType?: string;
  userId?: string;
  // New fields
  bio?: string;
  education?: Education[] | JSON[];
  wholeExperience?: Experience[] | JSON[];
}

const ProfileHeader = ({ user }: { user: ProfileHeaderProps }) => {
  const [showEducation, setShowEducation] = useState(false);
  const [showExperience, setShowExperience] = useState(false);

  // Parse education data if needed
  const educationData: Education[] = React.useMemo(() => {
    if (!user.education) return [];
    
    try {
      if (typeof user.education === 'string') {
        return JSON.parse(user.education);
      }
      return Array.isArray(user.education) ? user.education : [];
    } catch (error) {
      console.error("Failed to parse education data:", error);
      return [];
    }
  }, [user.education]);

  // Parse experience data if needed
  const experienceData: Experience[] = React.useMemo(() => {
    if (!user.wholeExperience) return [];
    
    try {
      if (typeof user.wholeExperience === 'string') {
        return JSON.parse(user.wholeExperience);
      }
      return Array.isArray(user.wholeExperience) ? user.wholeExperience : [];
    } catch (error) {
      console.error("Failed to parse experience data:", error);
      return [];
    }
  }, [user.wholeExperience]);

  // Format date for better display
  const formatDate = (dateString: string): string => {
    try {
      if (!dateString) return "Present";
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col">
      {/* Profile picture and basic info */}
      <div className="flex flex-col items-center">
        <Avatar className="h-28 w-28 border-4 border-white">
          <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
          <AvatarFallback className="bg-blue-100 text-2xl text-blue-800">
            {user?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>

        <h2 className="mt-4 text-xl font-semibold text-gray-800">
          {user?.name || "User"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {user?.role === "STUDENT"
            ? "Student"
            : user?.role === "MENTOR"
              ? "Mentor"
              : "User"}
        </p>

        <Link className="mt-4" href={`/mentors/${user?.userId}`}>
          <Button>Preview Mentor Profile</Button>
        </Link>
      </div>

      {/* Bio Section */}
      {user?.bio && (
        <div className="mt-6 space-y-2">
          <h3 className="text-sm font-medium text-gray-700">About</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{user.bio}</p>
        </div>
      )}

      {/* User details */}
      <div className="mt-6 space-y-3">
        {/* Company details */}
        {user?.currentCompany && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building size={16} className="text-gray-400" />
            <span>{user.currentCompany}</span>
          </div>
        )}

        {user?.jobTitle && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Briefcase size={16} className="text-gray-400" />
            <span>{user.jobTitle}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={16} className="text-gray-400" />
          <span>
            {user?.state}, India {user?.pinCode && `- ${user.pinCode}`}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail size={16} className="text-gray-400" />
          <span className="truncate">{user?.email || "user@example.com"}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} className="text-gray-400" />
          <span>
            Joined{" "}
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "Recently"}
          </span>
        </div>

        {user?.experience && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} className="text-gray-400" />
            <span>{user.experience} years of experience</span>
          </div>
        )}

        {user?.industry && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CircleDollarSign size={16} className="text-gray-400" />
            <span>Industry: {user.industry}</span>
          </div>
        )}

        {user?.companyType && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText size={16} className="text-gray-400" />
            <span>Company Type: {user.companyType}</span>
          </div>
        )}
      </div>

      {/* Education Section */}
      {educationData.length > 0 && (
        <div className="mt-6">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowEducation(!showEducation)}
          >
            <h3 className="text-sm font-medium text-gray-700 flex items-center">
              <GraduationCap size={16} className="mr-2 text-gray-500" />
              Education
            </h3>
            {showEducation ? (
              <ChevronUp size={16} className="text-gray-500" />
            ) : (
              <ChevronDown size={16} className="text-gray-500" />
            )}
          </div>
          
          {showEducation && (
            <div className="mt-2 space-y-4">
              {educationData.map((edu, idx) => (
                <div 
                  key={idx} 
                  className="border-l-2 border-gray-200 pl-4 py-1"
                >
                  <h4 className="text-sm font-medium text-gray-700">{edu.degree} in {edu.field}</h4>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  <p className="text-xs text-gray-500">
                    {edu.startYear} - {edu.endYear || 'Present'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Experience Section */}
      {experienceData.length > 0 && (
        <div className="mt-6">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowExperience(!showExperience)}
          >
            <h3 className="text-sm font-medium text-gray-700 flex items-center">
              <Briefcase size={16} className="mr-2 text-gray-500" />
              Work Experience
            </h3>
            {showExperience ? (
              <ChevronUp size={16} className="text-gray-500" />
            ) : (
              <ChevronDown size={16} className="text-gray-500" />
            )}
          </div>
          
          {showExperience && (
            <div className="mt-2 space-y-4">
              {experienceData.map((exp, idx) => (
                <div 
                  key={idx} 
                  className="border-l-2 border-gray-200 pl-4 py-1"
                >
                  <h4 className="text-sm font-medium text-gray-700">{exp.position}</h4>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </p>
                  {exp.description && (
                    <p className="mt-1 text-sm text-gray-600">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Skills/Interests */}
      <div className="mt-6">
        <h3 className="mb-2 text-sm font-medium text-gray-700">
          Hiring Fields
        </h3>
        <div className="flex flex-wrap gap-2">
          {user?.hiringFields.map((field) => (
            <Badge key={field} variant="secondary">
              {field}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;