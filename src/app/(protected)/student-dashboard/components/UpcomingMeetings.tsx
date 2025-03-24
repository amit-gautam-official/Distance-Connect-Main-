"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Video,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Updated interface to match the actual data structure
interface ApiMeeting {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  mentorUserId: string;
  studentUserId: string;
  selectedTime: string;
  selectedDate: Date;
  formatedDate: string;
  formatedTimeStamp: string;
  duration: number;
  meetUrl: string;
  eventId: string;
  userNote: string;
}

// Interface for the component's internal use
interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  mentor: {
    id: string;
    name: string;
    image?: string;
  };
  status: "upcoming" | "completed" | "cancelled";
  type: "video" | "chat";
}

interface UpcomingMeetingsProps {
  meetings: Promise<ApiMeeting[]> | ApiMeeting[];
}

const UpcomingMeetings: React.FC<UpcomingMeetingsProps> = ({ meetings }) => {
  const [processedMeetings, setProcessedMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processMeetings = async () => {
      try {
        setLoading(true);
        // Resolve the promise if it's a promise
        const resolvedMeetings =
          meetings instanceof Promise ? await meetings : meetings;

        // Get the current date
        const currentDate = new Date();

        // Transform API meetings to the format our component uses
        const transformedMeetings = resolvedMeetings
          .filter((meeting) => new Date(meeting.selectedDate) >= currentDate) // Filter meetings based on date
          .map((meeting) => ({
            id: meeting.id,
            title: meeting.userNote || "Mentorship Session",
            date: meeting.formatedDate,
            time: meeting.selectedTime,
            duration: meeting.duration,
            mentor: {
              id: meeting.mentorUserId,
              name: "Mentor", // We don't have the name in the API data
              image: undefined,
            },
            status: "upcoming" as const,
            type: meeting.meetUrl ? ("video" as const) : ("chat" as const),
          }));

        setProcessedMeetings(transformedMeetings);
      } catch (err) {
        console.error("Error processing meetings:", err);
        setError("Failed to load meetings");
      } finally {
        setLoading(false);
      }
    };

    processMeetings();
  }, [meetings]);

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // If loading, show loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Meetings</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10 text-center">
          <div className="text-center text-lg text-muted-foreground">
            Loading meetings...
          </div>
        </CardContent>
      </Card>
    );
  }

  // If error, show error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Meetings</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10 text-center">
          <div className="text-center text-lg text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  // If no meetings, show empty state
  if (processedMeetings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Meetings</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">No upcoming meetings</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Schedule a meeting with a mentor to get started
          </p>
          <Button>Schedule Meeting</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Meetings</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {processedMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="flex items-start gap-4 rounded-lg border p-3 transition-colors hover:bg-accent/50"
            >
              <div className="flex min-w-[60px] flex-col items-center justify-center text-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {formatDate(meeting.date).split(" ")[0]}
                </span>
                <span className="text-xl font-bold">
                  {formatDate(meeting.date).split(" ")[2]}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  {formatDate(meeting.date).split(" ")[1]}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="truncate font-medium">{meeting.title}</h4>
                  <Badge
                    variant={meeting.type === "video" ? "default" : "outline"}
                  >
                    {meeting.type === "video" ? "Video" : "Chat"}
                  </Badge>
                </div>

                <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {meeting.time} ({meeting.duration} min)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-xs">M</AvatarFallback>
                    </Avatar>
                    <span>Mentor</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  {meeting.type === "video" ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <MessageSquare className="h-4 w-4" />
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Reschedule</DropdownMenuItem>
                    <DropdownMenuItem>Add to Calendar</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Cancel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingMeetings;
