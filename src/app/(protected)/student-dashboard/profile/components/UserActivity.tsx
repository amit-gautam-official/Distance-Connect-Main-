"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MessageSquare,
  BookOpen,
  Award,
  UserCheck,
  Clock,
} from "lucide-react";

const UserActivity = () => {
  // Mock data for user activity - in a real app, this would come from an API
  const activities = [
    {
      id: "1",
      type: "meeting",
      title: "Meeting with Prashant Kumar Singh",
      description: "Discussed career opportunities in software development",
      date: "2023-11-15T14:30:00",
      icon: Calendar,
    },
    {
      id: "2",
      type: "message",
      title: "Sent message to Ananya Sharma",
      description: "Asked about UX design portfolio review",
      date: "2023-11-14T10:15:00",
      icon: MessageSquare,
    },
    {
      id: "3",
      type: "learning",
      title: "Completed React.js course",
      description: "Finished all modules and received certificate",
      date: "2023-11-12T18:45:00",
      icon: BookOpen,
    },
    {
      id: "4",
      type: "achievement",
      title: "Earned JavaScript certification",
      description: "Passed assessment with 92% score",
      date: "2023-11-10T09:20:00",
      icon: Award,
    },
    {
      id: "5",
      type: "connection",
      title: "Connected with Rahul Verma",
      description: "New mentor connection established",
      date: "2023-11-08T16:10:00",
      icon: UserCheck,
    },
    {
      id: "6",
      type: "meeting",
      title: "Group session on Machine Learning",
      description: "Attended workshop with 5 other students",
      date: "2023-11-05T11:00:00",
      icon: Calendar,
    },
    {
      id: "7",
      type: "learning",
      title: "Started Python for Data Science course",
      description: "Completed introduction module",
      date: "2023-11-03T20:30:00",
      icon: BookOpen,
    },
  ];

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) {
      return (
        "Today at " +
        date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    } else if (diffDays === 1) {
      return (
        "Yesterday at " +
        date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    } else if (diffDays < 7) {
      return (
        date.toLocaleDateString("en-US", { weekday: "long" }) +
        " at " +
        date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    } else {
      return (
        date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }) +
        " at " +
        date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      );
    }
  };

  // Filter activities by type
  const meetingActivities = activities.filter((a) => a.type === "meeting");
  const learningActivities = activities.filter((a) => a.type === "learning");
  const connectionActivities = activities.filter(
    (a) => a.type === "connection" || a.type === "message",
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity History</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <ActivityTimeline activities={activities} formatDate={formatDate} />
          </TabsContent>

          <TabsContent value="meetings" className="mt-6">
            <ActivityTimeline
              activities={meetingActivities}
              formatDate={formatDate}
            />
          </TabsContent>

          <TabsContent value="learning" className="mt-6">
            <ActivityTimeline
              activities={learningActivities}
              formatDate={formatDate}
            />
          </TabsContent>

          <TabsContent value="connections" className="mt-6">
            <ActivityTimeline
              activities={connectionActivities}
              formatDate={formatDate}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Activity Timeline Component
const ActivityTimeline = ({
  activities,
  formatDate,
}: {
  activities: any[];
  formatDate: (date: string) => string;
}) => {
  if (activities.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        No activities to display
      </div>
    );
  }

  return (
    <div className="relative space-y-6 pl-6 before:absolute before:left-2 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-gray-200">
      {activities.map((activity) => (
        <div key={activity.id} className="relative">
          <div className="absolute -left-6 flex h-4 w-4 items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-blue-600"></div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <activity.icon size={18} />
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-gray-800">{activity.title}</h3>
              <p className="text-sm text-gray-500">{activity.description}</p>
              <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                <Clock size={12} />
                <span>{formatDate(activity.date)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserActivity;
