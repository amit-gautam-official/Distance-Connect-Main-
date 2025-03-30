"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Search,
  Filter,
  X,
  UserCheck,
  MessageSquare,
  Calendar,
  Star,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

// All expertise areas from mentors
interface Mentor {
  id: string;
  mentorUserId: string;
  name: string;
  role: string;
  company: string;
  expertise: string[];
  avatarUrl: string;
  isFollowing: boolean;
  rating: number;
  selectedTime: string;
  formatedDate: string;
  formatedTimeStamp: string;
  duration: number;
  meetUrl: string;
  eventName: string;
  userNote: string;
}

const DashUpcoming = ({ mentorsData }: { mentorsData: Mentor[] }) => {
  const [mentors, setMentors] = useState<Mentor[]>(mentorsData);
  const router = useRouter();

  useEffect(() => {
    setMentors(mentorsData);
  }, [mentorsData]);


  

 

  return (
    <div className="overflow-hidden w-full">

      <CardContent>
        {mentorsData?.length > 0 ? (
          <div className="grid w-full gap-y-5">
            
            {mentors.map((mentor) => (
              <div
                key={mentor.meetUrl}
                className="flex h-full flex-col space-y-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={mentor.avatarUrl} alt={mentor.name} />
                      <AvatarFallback>
                        {mentor.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{mentor.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {mentor.role} at {mentor.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Star className="h-3 w-3" />
                      {mentor.rating.toFixed(1)}
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{mentor.formatedDate}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {mentor.selectedTime} ({mentor.duration} min)
                    </span>
                  </div>
                  {mentor.eventName && (
                    <div className="flex items-center text-sm">
                      <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{mentor.eventName}</span>
                    </div>
                  )}
                </div>

                {mentor.userNote && (
                  <div className="rounded-md bg-muted p-3 text-sm">
                    <p className="font-medium">Your note:</p>
                    <p className="text-muted-foreground">{mentor.userNote}</p>
                  </div>
                )}

                <div className="mt-auto flex justify-end space-x-2 pt-2">
                  {mentor.meetUrl && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => window.open(mentor.meetUrl, "_blank")}
                    >
                      Join Meeting
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/mentors/${mentor?.mentorUserId}`)
                    }
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Calendar className="mb-2 h-10 w-10 text-muted-foreground" />
            <h3 className="text-lg font-medium">No upcoming meetings</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              You don't have any scheduled meetings with mentors yet.
            </p>
            <Button
              className="mt-4"
              onClick={() => router.push("/student-dashboard/mentors")}
            >
              Find Mentors
            </Button>
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default DashUpcoming;
