import {
  Mentor,
  User,
  MeetingEvent,
  Availability,
  ScheduledMeetings,
} from "@prisma/client";
import { db } from "@/server/db";
import { auth0 } from "@/lib/auth0";
import { Offerings } from "@/components/mentor-profile/Offerings";
import { AvailabilityCard } from "@/components/mentor-profile/AvailabilityCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeCheck, MapPin, Briefcase, Star } from "lucide-react";

interface Offering {
  id: string;
  title: string;
  description: string;
  rating: number;
  duration: string;
  price: string;
  type: string;
  repliesIn: string;
  priority: number;
  mentorUserId: string;
  userEmail: string;
}

type ScheduledMeetingsWithRelations = ScheduledMeetings & {
  student: {
    user: User;
  };
};

type MentorWithRelations = Mentor & {
  user: User | null;
  meetingEvents: MeetingEvent[];
  availability: Availability | null;
  scheduledMeetings: ScheduledMeetingsWithRelations[];
};

type SegmentParams = {
  mentorName: string;
};

interface PageProps {
  params: Promise<SegmentParams>;
  searchParams?: Promise<any>;
}

async function getMentorData(
  mentorName: string,
): Promise<MentorWithRelations | null> {
  try {
    const mentor = await db.mentor.findFirst({
      where: {
        userId: mentorName,
      },
      include: {
        user: true,
        meetingEvents: true,
        availability: true,
        scheduledMeetings: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    return mentor as MentorWithRelations;
  } catch (error) {
    console.error("Error fetching mentor data:", error);
    return null;
  }
}

export default async function OfferingsPage({ params }: PageProps) {
  const { mentorName } = await params;

  const mentorData = await getMentorData(mentorName);
  const session = await auth0.getSession();
  const userEmail = session?.user.email;

  const offerings = mentorData?.meetingEvents.map((event) => ({
    id: event.id ?? "",
    title: event.eventName || "",
    description: event.description || "",
    rating: 4.8,
    duration: `${event.duration} Mins`,
    price: "₹799",
    type: event.eventName || "",
    repliesIn: "2 days",
    priority: 134,
    mentorUserId: mentorName ?? "",
    userEmail: userEmail ?? "",
  }));

  return (
    <div className="container mx-auto lg:pt-[100px]  px-4  md:px-6 lg:px-8">
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Avatar className="h-16 w-16 border-2 border-blue-100 shadow-sm">
            <AvatarImage
              src={mentorData?.user?.avatarUrl || ""}
              alt={mentorData?.mentorName || "Mentor Avatar"}
            />
            <AvatarFallback className="bg-blue-500 text-lg font-medium text-white">
              {mentorData?.mentorName?.[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">
              {mentorData?.mentorName}
            </h2>
            
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span>{mentorData?.jobTitle} at {mentorData?.currentCompany}</span>
              </div>
         
           
            </div>
          </div>
          
          <div className="mt-3 flex flex-col items-start gap-2 sm:mt-0 sm:items-end">
            <div className="rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-800">
              ₹2000/session
            </div>
            <div className="flex items-center text-sm text-blue-600">
              <BadgeCheck className="mr-1 h-4 w-4" />
              Verified Mentor
            </div>
          </div>
        </div>
        
        {mentorData?.bio && (
          <div className="mt-4 border-t pt-4 text-gray-600">
            <p>{mentorData.bio}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="sticky top-6 rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">Availability</h3>
            <AvailabilityCard avail={mentorData?.availability!} />
          </div>
        </div>
        
        <div className="lg:col-span-8">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-6 text-lg font-semibold text-gray-800">Session Offerings</h3>
            <Offerings offerings={offerings!} />
          </div>
        </div>
      </div>
    </div>
  );
}