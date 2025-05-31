"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Mail,
  Link as LinkIcon,
  Building,
  CircleDollarSign,
  Clock,
  FileText,
  Phone,
} from "lucide-react";
import { api } from "@/trpc/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  name: string;
  email: string;
  image: string;
  role: string;
  state: string;
  createdAt: Date;
  interestFields: string[];
  instituteName: string;
  // Additional optional fields
  pinCode?: string;
  phoneNumber?: string;
  courseSpecialization?: string;
  companyName?: string;
  jobTitle?: string;
  experience?: string;
  industry?: string;
  studentRole?: string;
}

const ProfileHeader = ({ user }: { user: ProfileHeaderProps }) => {
  // console.log(user);

  return (
    <div className="flex flex-col">
      {/* Profile picture and basic info */}
      <div className="flex flex-col items-center">
        <Avatar className="h-28 w-28 border-4 border-white object-cover">
          <AvatarImage className="object-cover" src={user?.image || ""} alt={user?.name || "User"} />
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
      </div>

      {/* User details */}
      <div className="mt-6 space-y-3">
        {user?.role === "STUDENT" && (
          <>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <GraduationCap size={16} className="text-gray-400" />
              <span>{user?.instituteName}</span>
            </div>

            {user?.courseSpecialization && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText size={16} className="text-gray-400" />
                <span>Specialization: {user.courseSpecialization}</span>
              </div>
            )}
          </>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={16} className="text-gray-400" />
          <span>
            {user?.state}, India 
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone size={16} className="text-gray-400" />
          <span>
            {user?.phoneNumber}
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

        {/* Professional details */}
        {user?.companyName && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building size={16} className="text-gray-400" />
            <span>{user.companyName}</span>
          </div>
        )}

        {user?.jobTitle && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Briefcase size={16} className="text-gray-400" />
            <span>{user.jobTitle}</span>
          </div>
        )}

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
      </div>

      {/* Skills/Interests */}
      <div className="mt-6">
        <h3 className="mb-2 text-sm font-medium text-gray-700">Interests</h3>
        <div className="flex flex-wrap gap-2">
          {user?.interestFields.map((field) => (
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
