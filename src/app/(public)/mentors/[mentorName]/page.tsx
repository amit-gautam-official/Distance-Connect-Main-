import React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import {
  Mentor,
  User,
  MeetingEvent,
  Availability,
  ScheduledMeetings,
} from "@prisma/client";
import { notFound } from "next/navigation";
import { db } from "@/server/db";

// Component imports
import { ProfileHeader } from "@/components/mentor-profile/ProfileHeader";
import { AvailabilityCard } from "@/components/mentor-profile/AvailabilityCard";
import { ProfileTabs } from "@/components/mentor-profile/ProfileTabs";
import { Sidebar } from "@/components/mentor-profile/Sidebar";
import { auth0 } from "@/lib/auth0";

// Types for mentor data with relations
type MentorWithRelations = Mentor & {
  user: User | null;
  meetingEvents: MeetingEvent[];
  availability: Availability | null;
  scheduledMeetings: ScheduledMeetingsWithRelations[];
};

type ScheduledMeetingsWithRelations = ScheduledMeetings & {
  student: {
    user: User;
  };
};

type SimilarMentorProfile = {
  id: string;
  name: string;
  title: string;
  company: string;
  avatarUrl: string;
};

// Function to fetch mentor data
async function getMentorData(
  mentorName: string,
): Promise<MentorWithRelations | null> {
  try {

    // Find the mentor by mentorName
    const mentor = await db.mentor.findFirst({
      where: {
        userId: mentorName,
      },
      include: {
        user: true, // Include related User data
        meetingEvents: true, // Include meeting events
        availability: true, // Include availability
        scheduledMeetings: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
          },
        }, // Include scheduled meetings with student info
      },
    });

    return mentor as MentorWithRelations;
  } catch (error) {
    console.error("Error fetching mentor data:", error);
    return null;
  }
}

// Function to fetch similar mentors based on industry or job title
async function getSimilarMentors(
  currentMentor: MentorWithRelations,
  limit: number = 3,
): Promise<SimilarMentorProfile[]> {
  if (!currentMentor) return [];

  try {
    const similarMentors = await db.mentor.findMany({
      where: {
        OR: [
          { industry: currentMentor.industry },
          { jobTitle: currentMentor.jobTitle },
        ],
        NOT: {
          id: currentMentor.id, // Exclude current mentor
        },
      },
      include: {
        user: true,
      },
      take: limit,
    });

    return similarMentors.map((mentor) => ({
      id: mentor.id,
      name: mentor.mentorName || "",
      title: mentor.jobTitle || "Mentor",
      company: `@${mentor.currentCompany || "Company"}`,
      avatarUrl: mentor.user?.avatarUrl || "",
    }));
  } catch (error) {
    console.error("Error fetching similar mentors:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { mentorName: string };
}) {
  const mentorId =  await params.mentorName;
  const mentor = await getMentorData(mentorId);


  if (!mentor) {
    return {
      title: "Mentor Not Found",
      description: "The requested mentor profile could not be found.",
    };
  }

  return {
    title: `${mentor.mentorName} | Mentor Profile`,
    description: `Connect with ${mentor.mentorName}, a ${mentor.jobTitle} at ${mentor.currentCompany} with ${mentor.experience}   ence.`,
  };
}

export default async function MentorProfilePage({
  params,
}: {
  params: { mentorName: string };
}) {
  const mentorId = await params.mentorName;
  const mentorData = await getMentorData(mentorId);
  console.log("mentorData", mentorData);
  const session =  await auth0.getSession();
  const userEmail = session?.user.email;

  if (!mentorData) {
    notFound();
  }

  // Calculate number of mentees based on scheduled meetings
  const uniqueMentees = new Set(
    mentorData.scheduledMeetings.map((meeting: any) => meeting.studentUserId),
  );
  const menteeCount = uniqueMentees.size;

  // Format experience data from scheduled meetings
  const experiences = [
    {
      title: mentorData.jobTitle || "Senior Product Designer",
      company: mentorData.currentCompany || "PayPal",
      period: `Present - November, ${new Date().getFullYear()}`,
      duration: "(7yr 9M)",
    },
    {
      title: "Senior Product Designer",
      company: "PayPal",
      period: "December, 2023 - September, 2022",
      duration: "(1yr 3M)",
    },
    {
      title: "Senior Product Designer",
      company: "PayPal",
      period: "August, 2022 - July, 2021",
      duration: "(1yr 1M)",
    },
  ];

  // Extended skills with categories from the image
  const skillGroups = [
    { category: "Programming", skills: ["C++", "C#", "JavaScript", "Python"] },
    {
      category: "Design",
      skills: ["UI Designs", "UX Research", "Wireframing"],
    },
    { category: "Data", skills: ["Data Structure", "Algorithms", "SQL"] },
    { category: "Others", skills: mentorData.hiringFields || [] },
  ];

  // Tools the mentor uses
  const tools = ["Figma", "VS Code", "Photoshop"];

  // Offerings with sample data as shown in the image

  const offerings = mentorData?.meetingEvents.map((event) => ({
    id: event.id,
    title: event.eventName,
    description: event.description || "",
    rating: 4.8,
    duration: `${event.duration} Mins`,
    price: "₹799",
    type: event.eventName,
    repliesIn: "2 days",
    priority: 134,
    mentorUserId : mentorId,
    userEmail : userEmail ?? ""
  }));

 

  // Mock articles section - could be replaced with real data if available
  const articles = [
    {
      title: "The guide: Apply for a job",
      views: "12,823 viewers",
    },
    {
      title: "Your dream job and how you can get it",
      views: "5,112 viewers",
    },
    {
      title: "How you know it: 15 steps to find job",
      views: "7,231 viewers",
    },
  ];

  // Get similar profiles - mentors in the same industry or with same job title
  const similarProfiles = await getSimilarMentors(mentorData);

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      name: "Aditya Kumar",
      avatar: "",
      role: "Software Developer",
      rating: 5,
      date: "2 weeks ago",
      content:
        "Excellent mentor! The mock interview session was incredibly helpful and provided detailed feedback on my SQL skills. Looking forward to another session.",
    },
    {
      id: 2,
      name: "Priya Sharma",
      avatar: "",
      role: "Data Science Student",
      rating: 4,
      date: "1 month ago",
      content:
        "Very insightful guidance on career progression in data analysis. Really appreciated the practical tips and industry insights.",
    },
  ];

  // Availability data
  const availability = {
    timezone: "Asia/Kolkata (GMT+5:30)",
    availableDays: ["Monday", "Wednesday", "Friday"],
    availableHours: "7:00 PM - 10:00 PM",
    nextAvailable: "Tomorrow",
  };

  // Professional background data
  const professionalBackground = {
    education: [
      {
        degree: "Master of Computer Science",
        institution: "Delhi Technological University",
        year: "2018-2020",
      },
      {
        degree: "Bachelor of Technology",
        institution: "VIT University",
        year: "2014-2018",
      },
    ],
    certifications: [
      "AWS Certified Solutions Architect",
      "Google Professional Data Engineer",
      "Microsoft Certified: Azure Data Scientist Associate",
    ],
  };

  return (
    <div className="mx-auto max-w-7xl pt-[150px]   px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Main content area - 2/3 width on desktop */}
        <div className="space-y-6 md:col-span-2">
          {/* Profile header */}
          <ProfileHeader
            mentor={{
              mentorName: mentorData.mentorName || "Unnamed Mentor",
              jobTitle: mentorData.jobTitle || "Mentor",
              currentCompany: mentorData.currentCompany || "Company",
              experience: mentorData.experience || "0 years",
              industry: mentorData.industry || "Technology",
              user: mentorData.user
                ? { avatarUrl: mentorData.user.avatarUrl || "" }
                : undefined,
            }}
            
            userId={mentorId || ""}
            menteeCount={menteeCount}
            skills={mentorData.hiringFields || []}
          />
          
          {/* Availability Card */}
          <AvailabilityCard 
          avail={mentorData?.availability!} availability={availability} />

          {/* Tabs Navigation */}
          <ProfileTabs
            experiences={experiences}
            education={professionalBackground.education}
            certifications={professionalBackground.certifications}
            skillGroups={skillGroups}
            tools={tools}
            offerings={offerings}
            reviews={reviews}
          />
        </div>

        {/* Sidebar - 1/3 width on desktop */}
        <Sidebar
          mentorName={mentorData.mentorName || ""}
          articles={articles}
          similarProfiles={similarProfiles}
          mentorUserId={mentorId || ""}
        />
      </div>
    </div>
  );
}
