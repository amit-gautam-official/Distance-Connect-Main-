import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin } from "lucide-react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

interface Mentor {
  userId: string;
  mentorName: string | null;
  jobTitle: string | null;
  experience: string | null;
  industry: string | null;
  currentCompany: string | null;
  hiringFields: string[];
  meetingEvents: any[]; // Update this with proper type when available
  state?: string | null; // Add state property
}

interface MentorCardProps {
  mentor: Mentor;
}

export function MentorCard({ mentor }: MentorCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="relative overflow-hidden bg-white p-4">
      <div className="absolute right-4 top-4 rounded-full bg-[#E5F7E5] px-3 py-1 text-sm">
        Starting ₹2000
      </div>
      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Avatar Section */}
        <div className="relative flex justify-center sm:justify-start">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
            <AvatarFallback className="text-xl">
              {mentor.mentorName?.[0]}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <h3 className="text-center text-xl font-semibold sm:text-left">
            {mentor.mentorName}
          </h3>

          {/* Location and Languages */}
          <div className="mt-1 flex flex-wrap justify-center gap-4 text-sm text-gray-600 sm:justify-start">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {mentor?.state
                ? mentor.state.charAt(0).toUpperCase() + mentor.state.slice(1)
                : "Location N/A"}
            </div>
            <div className="flex items-center gap-1">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.06 18H4.94A1.94 1.94 0 0 1 3 16.06V4.94A1.94 1.94 0 0 1 4.94 3h14.12A1.94 1.94 0 0 1 21 4.94v11.12A1.94 1.94 0 0 1 19.06 18Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M3 13.5h18m-13.5-9v9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              English, Hindi
            </div>
          </div>

          {/* Company Info */}
          <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:items-start">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="text-center sm:text-left">
              <div className="font-medium">{mentor.jobTitle}</div>
              <div className="text-sm text-gray-600">
                {mentor.currentCompany}
              </div>
            </div>
          </div>

          {/* Skills/Hiring Fields */}
          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
            {mentor.hiringFields?.slice(0, 3).map((field, index) => (
              <Badge key={`${field}-${index}`} variant="outline">
                {field}
              </Badge>
            ))}
            {mentor.hiringFields && mentor.hiringFields.length > 3 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <span className="text-xs">
                  +{mentor.hiringFields.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-4 text-sm text-gray-600">
        {isExpanded ? (
          <>
            Looking for a mentor who makes coding simple and practical?
            I&apos;ve spent {mentor.experience}+ years building web apps,
            mastering both frontend and backend. I can help you write clean,
            efficient code, break down complex topics, and guide you toward
            real-world solutions. With a focus on practical learning, I&apos;ll
            help you understand industry best practices, system design
            principles, and how to write maintainable code. Let&apos;s work
            together to accelerate your growth in tech.{" "}
            <button
              onClick={() => setIsExpanded(false)}
              className="text-blue-600 hover:underline"
            >
              show less
            </button>
          </>
        ) : (
          <>
            Looking for a mentor who makes coding simple and practical?
            I&apos;ve spent {mentor.experience}+ years building web apps,
            mastering both frontend and backend. I can help you write clean,
            efficient code, break down complex topics, and guide you toward
            real-world solutions...{" "}
            <button
              onClick={() => setIsExpanded(true)}
              className="text-blue-600 hover:underline"
            >
              read more
            </button>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center text-sm text-gray-600 sm:text-left">
          For:{" "}
          <span className="font-medium">Fresher | Working Professional</span>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Link href={`/mentors/${mentor.userId}`} className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              View Profile
            </Button>
          </Link>
          <Button className="w-full sm:w-auto">Check Availability</Button>
        </div>
      </div>
    </Card>
  );
}
