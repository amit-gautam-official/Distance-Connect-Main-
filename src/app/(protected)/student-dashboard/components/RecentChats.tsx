"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";

// Updated interface to match the actual data structure
interface Chat {
  id: string;
  student: {
    studentName: string | null;
  };
  lastMessage: string;
  studentUnreadCount: number;
  mentor: {
    mentorName: string | null;
  };
}

interface RecentChatsProps {
  chats: Chat[];
}

const RecentChats: React.FC<RecentChatsProps> = ({ chats = [] }) => {
  // Format timestamp to relative time (mock function since we don't have actual timestamps)
  const getRelativeTime = () => {
    // This is a placeholder - in a real app, you'd calculate this from actual timestamps
    const times = ["2m ago", "15m ago", "1h ago", "3h ago", "Yesterday"];
    return times[Math.floor(Math.random() * times.length)];
  };

  // If no chats, show empty state
  if (chats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Chats</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">No recent conversations</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Start a conversation with a mentor
          </p>
          <Button>Start Chat</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Chats</CardTitle>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent/50"
            >
              <div className="relative">
                <Avatar>
                  <AvatarFallback>
                    {chat.mentor.mentorName?.[0] || "M"}
                  </AvatarFallback>
                </Avatar>
                {chat.studentUnreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {chat.studentUnreadCount}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between">
                  <h4 className="truncate font-medium">
                    {chat.mentor.mentorName || "Mentor"}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {getRelativeTime()}
                  </span>
                </div>
                <p
                  className={`truncate text-sm ${chat.studentUnreadCount > 0 ? "font-medium" : "text-muted-foreground"}`}
                >
                  {chat.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentChats;
