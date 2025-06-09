"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Calendar, MessageSquare } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AvailabilityCard } from "../mentor-profile/AvailabilityCard";
import { useRouter } from "next/navigation";
import { JSONValue } from "node_modules/superjson/dist/types";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useSession } from "next-auth/react";

interface Mentor {
  availability: Avail | null;
  userId: string;
  mentorName: string | null;
  jobTitle: string | null;
  experience: string | null;
  industry: string | null;
  currentCompany: string | null;
  companyEmailVerified: boolean;
  hiringFields: string[];
  bio: string | null;
  user: {
    image: string | null;
  };
  meetingEvents: any[]; // Update this with proper type when available
  state?: string | null; // Add state property
}

interface Avail {
  id: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  mentorUserId: string | null;
  daysAvailable: JSONValue | null; // Use JSONValue for dynamic keys
  bufferTime: number | null;
}

interface MentorCardProps {
  mentor: Mentor;
}

export function MentorCard({ mentor }: MentorCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpandedBio, setIsExpandedBio] = useState(false);
  const [canChat, setCanChat] = useState<boolean>(false);
  const [isCheckingMeeting, setIsCheckingMeeting] = useState<boolean>(false);
  const [isLoadingMeetingStatus, setIsLoadingMeetingStatus] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const session = useSession();

  // Check if the student has a meeting with this mentor
  const getMeetingStatus = api.scheduledMeetings.hasMeetingWithMentor.useQuery(
    { mentorUserId: mentor.userId },
    { enabled: false },
  );
  
    const meetingStatusQuery = api.scheduledMeetings.hasMeetingWithMentor.useQuery(
      { mentorUserId: mentor.userId },
      { enabled: !!session?.data?.user, refetchOnWindowFocus: false }
    );


  // Update local state when query results change
  useEffect(() => {
    if (meetingStatusQuery.status === 'success') {
      setCanChat(!!meetingStatusQuery.data);
      setIsLoadingMeetingStatus(false);
    } else if (meetingStatusQuery.status === 'error') {
      setCanChat(false);
      setIsLoadingMeetingStatus(false);
    }
  }, [meetingStatusQuery.status, meetingStatusQuery.data]);

  const createChatRoom = api.chatRoom.createChatRoomByMentorId.useMutation();

  // Handle chat room creation results
  useEffect(() => {
    if (createChatRoom.status === "success" && createChatRoom.data) {
      router.push(`/chat?mentorId=${mentor.userId}`);
    } else if (createChatRoom.status === "error" && createChatRoom.error) {
      toast({
        title: "Cannot start chat",
        description:
          createChatRoom.error.message ||
          "You must book a meeting with this mentor first",
        variant: "destructive",
      });
    }
  }, [
    createChatRoom.status,
    createChatRoom.data,
    createChatRoom.error,
    router,
    toast,
  ]);

  // Check meeting status when the component mounts
  useEffect(() => {
    setIsCheckingMeeting(true);
    getMeetingStatus.refetch();
  }, []);

  // Function to truncate bio text
  const truncateBio = (text: string, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim();
  };

  const handleChatClick = (e: React.MouseEvent) => {
    if (!session?.data?.user) {
      return; // Let the link navigate to login
    }
    
    // If no meeting booking, prevent navigation and show toast
    if (!canChat) {
      e.preventDefault();
      toast({
        title: "Cannot start chat",
        description: "You need to book a meeting with this mentor before you can chat.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Card className="group flex h-full flex-col overflow-hidden bg-white transition-all hover:shadow-lg">
        {/* Avatar and Basic Info */}
        <div className="relative flex flex-col items-center p-6 pb-4">
          {/* Free session badge moved to corner */}
          <div className="absolute right-0 top-0">
            <Badge className="m-2 bg-green-100 text-green-800 hover:bg-green-200 text-xs font-medium">
              Free Session
            </Badge>
          </div>

          <Avatar className="mb-4 h-20 w-20 border-2 border-white shadow">
            <AvatarImage
              src={mentor.user.image || ""}
              alt={mentor.mentorName || "Mentor Avatar"}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-lg font-medium text-primary">
              {mentor.mentorName?.[0]?.toUpperCase() || "M"}
            </AvatarFallback>
          </Avatar>

          <h3 className="mb-1 text-center text-lg font-semibold">
            {mentor.mentorName || "Unnamed Mentor"}
          </h3>

          <p className="mb-2 text-center text-sm text-muted-foreground">
            {mentor.jobTitle || "Role not specified"}
            {mentor.experience && (
              <>
                <span className="mx-1.5 text-xs">•</span>
                <span>{mentor.experience} YOE</span>
              </>
            )}
          </p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span className="line-clamp-1">
              {mentor.currentCompany || "Not specified"}
            </span>
            {mentor.companyEmailVerified === false && (
              <Badge
                variant="outline"
                className="border-amber-300 bg-amber-50 text-xs text-amber-600"
              >
                Unverified
              </Badge>
            )}
          </div>

          <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>
              {mentor?.state
                ? mentor.state.charAt(0).toUpperCase() + mentor.state.slice(1)
                : "Location N/A"}
            </span>
          </div>
        </div>

        {/* Bio Section - Improved Read More/Less functionality */}
        <div className="px-6 pb-4">
          <div className="text-sm text-muted-foreground">
            {mentor.bio ? (
              truncateBio(mentor.bio) + "..."
            ) : (
              <p className="italic text-muted-foreground">No bio available</p>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="flex-1 px-6 pb-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {mentor.hiringFields?.length > 0 ? (
              <>
                {mentor.hiringFields.slice(0, 3).map((field, index) => (
                  <Badge
                    key={`${field}-${index}`}
                    variant="secondary"
                    className="text-xs"
                  >
                    {field}
                  </Badge>
                ))}
                {mentor.hiringFields.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{mentor.hiringFields.length - 3}
                  </Badge>
                )}
              </>
            ) : (
              <span className="text-xs italic text-muted-foreground">
                No skills specified
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="m-auto mt-auto border-t border-border bg-muted/10 py-4">
          <div className="flex items-center justify-between gap-2">
            <Link href={`/mentors/${mentor.userId}`} className="">
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-primary/5"
              >
                View Profile
              </Button>
            </Link>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={
                      session?.data?.user
                        ? `/chat?mentorId=${mentor.userId}`
                        : "/auth/login"
                    }
                    onClick={handleChatClick}
                    className="block w-full"
                  >
                    <Button
                      variant="outline"
                      className={`w-full hover:bg-blue-50 ${isLoadingMeetingStatus ? "opacity-70" : ""}`}
                      disabled={isLoadingMeetingStatus}
                    >
                      {isLoadingMeetingStatus ? (
                        <>
                          <span className=" h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></span>
                        </>
                      ) : (
                          <MessageSquare className="h-4 w-4" /> 
                      )}
                    </Button>
                  </Link>
                </TooltipTrigger>
                { session?.data?.user ? 
                  !canChat && !isLoadingMeetingStatus && (
                  <TooltipContent>
                    <p>Book a meeting first to enable chat</p>
                  </TooltipContent>
                ) :
                <TooltipContent>
                  <p>Please log in to chat</p>
                </TooltipContent>
                }
                
              </Tooltip>  
            </TooltipProvider>

            <div className="">
              <Button
                size="sm"
                className="flex-1 "
                onClick={() => setIsModalOpen(true)}
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Booking Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-md md:max-w-xl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Book a Session with {mentor.mentorName || "Mentor"}
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto py-4">
            {/* Mentor quick info */}
            <div className="mb-6 flex items-center space-x-3 px-1">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={mentor.user.image || ""}
                  alt={mentor.mentorName || "Mentor"}
                />
                <AvatarFallback>{mentor.mentorName?.[0] || "M"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h4 className="font-medium">{mentor.mentorName || "Mentor"}</h4>
                <p className="text-sm text-muted-foreground">
                  {mentor.jobTitle ? `${mentor.jobTitle} at ` : ""}
                  {mentor.currentCompany || "Company not specified"}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                First Session Free
              </Badge>
            </div>

            {/* Availability Calendar */}
            <div className="mb-4">
              {mentor.availability ? (
                <AvailabilityCard avail={mentor.availability} />
              ) : (
                <div className="rounded-md bg-muted/20 p-6 text-center">
                  <p className="text-muted-foreground">
                    No availability information found
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => router.push(`/mentors/${mentor.userId}/offerings`)}
            >
              Book a Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
