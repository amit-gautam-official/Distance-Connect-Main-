"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, X } from "lucide-react";
import Link from "next/link";
import { AvatarModal } from "./Modal";

interface ProfileHeaderProps {
  mentor: {
    profileBanner: string;
    mentorName: string;
    jobTitle: string;
    currentCompany: string;
    companyEmailVerified: boolean;
    experience: string;
    industry: string;
    bio ?: string;
    user?: {
      avatarUrl: string;
    };
  };
  menteeCount: number;
  skills: string[];
  userId: string;
  userEmail: string;
  averageRating?: number;
}

export function ProfileHeader({
  mentor,
  menteeCount,
  skills,
  userId,
  userEmail,

  averageRating = 5.0,
}: ProfileHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
    
      {mentor?.profileBanner ? (
        <img
          src={mentor?.profileBanner}
          alt="Profile Banner"
          className="h-48 w-full object-cover"
        />
      ):(
        <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
      )}

      <div className="relative p-8 pt-0">
        {/* Profile image overlapping the cover */}
        <div 
          className="absolute -top-[150px] left-8 h-36 w-36 cursor-pointer overflow-hidden rounded-full border-4 border-white bg-white shadow-md"
          onClick={openModal}
        >
          <Avatar className="h-36 w-36">
            <AvatarImage
              src={mentor.user?.avatarUrl || ""}
              alt={mentor.mentorName || ""}
              className="h-36 w-36 object-cover"
            />
            <AvatarFallback className="h-32 w-32 bg-gradient-to-br from-blue-100 to-blue-200 text-2xl text-blue-700">
              {mentor.mentorName?.charAt(0) || "M"}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Avatar Modal */}
        <AvatarModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          imageUrl={mentor.user?.avatarUrl!}
          name={mentor.mentorName}
        />

        {/* Profile info */}
        <div className="mt-16 pb-2">
          <div className="flex flex-wrap items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {mentor.mentorName}
              </h1>
              <p className="text-gray-700">{mentor.jobTitle}</p>
              { mentor.companyEmailVerified ?
                <p className="font-medium text-blue-600">
                @{mentor.currentCompany}
              </p> : <p className="font-medium text-blue-600">
                <span className="text-red-500">Not Verified</span> @{mentor.currentCompany}
              </p>}
            </div>
            <div className="mt-2 flex items-center space-x-2 md:mt-0">
              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              <span className="font-medium">
                {averageRating.toFixed(1)} ({menteeCount}+ Mentees)
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-800">
              <span className="font-medium">
                {mentor.experience} of experience
              </span>
            </div>
            {mentor.companyEmailVerified && 
            <div className="flex items-center rounded-full bg-gray-50 px-3 py-1 text-sm text-gray-800">
              <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                C
              </div>
              <span>{mentor.currentCompany}</span>
            </div> 
            }
            <div className="flex items-center rounded-full bg-gray-50 px-3 py-1 text-sm text-gray-800">
              <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
                I
              </div>
              <span>{mentor.industry}</span>
            </div>
          </div>

          <p className="mt-6 rounded-lg border border-gray-100 bg-gray-50 p-4 text-gray-600">
            <span className="font-medium text-gray-800">About Me: </span>
            {mentor?.bio || "No bio available."}
          </p>

          <div className="mt-6 flex flex-col justify-between gap-3 sm:flex-row">
            <div className="flex-1">
              <h3 className="mb-2 text-sm font-medium uppercase text-gray-500">
                Hiring Fields
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 4).map((skill, index) => (
                  <Badge
                    key={index}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-gray-800 hover:bg-gray-100"
                  >
                    {skill}
                  </Badge>
                ))}
                {skills.length > 4 && (
                  <Badge
                    variant="outline"
                    className="rounded-full border border-blue-200 bg-transparent px-3 py-1 text-blue-600 hover:bg-blue-50"
                  >
                    +{skills.length - 4} More
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex justify-start space-x-3 pt-4 sm:mt-0 sm:justify-end">
              <Link
                href={
                  userEmail
                    ? `/chat?mentorId=${userId}`
                    : "/auth/login"
                }
                className="m-auto text-sm h-10 md:text-md rounded-md bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700"
              >
                Ask a Question
              </Link>
              <Link
                href={"/"} 
                className="m-auto text-sm h-10 md:text-md rounded-md border border-blue-600 bg-white px-4 py-2 text-blue-600 shadow-sm hover:bg-gray-100"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


