"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Updated user type to match the actual data structure
interface User {
  name: string | null;
  id: string;
  kindeId: string;
  email: string;
  avatarUrl: string | null;
  role: any; // Using 'any' for Role enum since we don't have the exact type
  isRegistered: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface WelcomeHeaderProps {
  user: User | null | undefined;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ user }) => {
  // Get current time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Get first name from full name
  const firstName = user?.name?.split(" ")[0] || "Student";

  return (
    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary/10">
          <AvatarImage
            src={user?.avatarUrl || ""}
            alt={user?.name || "Student"}
          />
          <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
            {firstName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {getGreeting()}, {firstName}!
          </h1>
          <p className="text-muted-foreground">
            Welcome to your learning dashboard. Here's what's happening today.
          </p>
        </div>
      </div>

      <div className="flex gap-2 self-end md:self-auto">
        <Button variant="outline" size="sm" className="gap-1">
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Notifications</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-1">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Schedule</span>
        </Button>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          <span className="hidden sm:inline">New Meeting</span>
        </Button>
      </div>
    </div>
  );
};

export default WelcomeHeader;
