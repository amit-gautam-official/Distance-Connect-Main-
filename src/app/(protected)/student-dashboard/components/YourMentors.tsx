import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MentorList from "../profile/components/MentorList";
import DashUpcoming from "./DashUpcoming";


interface Mentor {
  id : string;
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

interface YourMentorsProps {
  mentors: Mentor[];
}

const YourMentors: React.FC<YourMentorsProps> = ({ mentors }) => {
  return (
    <Card className="w-full h-[360px]  overflow-y-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Upcoming Meetings</CardTitle>
        </div>
      </CardHeader>
      <DashUpcoming mentorsData={mentors} />
    </Card>
  );
};

export default YourMentors;
