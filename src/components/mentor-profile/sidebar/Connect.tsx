"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// Removed server-side import: import { auth } from "@/server/auth";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
interface ConnectProps {
  mentorName: string;
  mentorUserId: string;
}


export function Connect({ mentorName, mentorUserId }: ConnectProps) {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [canChat, setCanChat] = useState(false);
  const [isLoadingMeetingStatus, setIsLoadingMeetingStatus] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Use TRPC to check if the user is logged in instead of server auth
  const userQuery = api.user.getMe.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (userQuery.data) {
      setSession({ user: userQuery.data });
    }
  }, [userQuery.data]);

  // Check if user has booked a meeting with this mentor
  const meetingStatusQuery = api.scheduledMeetings.hasMeetingWithMentor.useQuery(
    { mentorUserId },
    { enabled: !!session?.user, refetchOnWindowFocus: false }
  );
  
  // Update local state based on query results
  useEffect(() => {
    if (meetingStatusQuery.status === 'success') {
      setCanChat(!!meetingStatusQuery.data);
      setIsLoadingMeetingStatus(false);
    } else if (meetingStatusQuery.status === 'error') {
      setCanChat(false);
      setIsLoadingMeetingStatus(false);
    }
  }, [meetingStatusQuery.status, meetingStatusQuery.data]);

  const handleChatClick = (e: React.MouseEvent) => {
    if (!session?.user) {
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
    <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold text-gray-900">
        Connect with {mentorName}
      </h3>
      <p className="mb-4 text-gray-600">
        Get personalized guidance and mentorship to accelerate your career
        growth.
      </p>
      <div className="space-y-3">
        <Link href={`/mentors/${mentorUserId}/offerings`} className="block mb-2 w-full">
          <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
            Schedule a Call
          </Button>
        </Link>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={session?.user ? `/chat?mentorId=${mentorUserId}` : "/auth/login"}
                onClick={handleChatClick}
                className="block w-full"
              >
                <Button
                  variant="outline"
                  className={`w-full border-blue-600 text-blue-600 hover:bg-blue-50 ${isLoadingMeetingStatus ? 'opacity-70' : ''}`}
                  disabled={isLoadingMeetingStatus}
                >
                  {isLoadingMeetingStatus ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></span>
                      Checking...
                    </>
                  ) : (
                    "Send a Message"
                  )}
                </Button>
              </Link>
            </TooltipTrigger>
            {!canChat && !isLoadingMeetingStatus && (
              <TooltipContent>
                <p>Book a meeting first to enable chat</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
