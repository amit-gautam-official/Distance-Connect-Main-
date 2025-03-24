"use client";
import { api } from "@/trpc/react";
import React from "react";
import { MessageSquare, User } from "lucide-react";

type Room = {
  id: string;
  student: {
    studentName: string | null;
  };
  lastMessage: string;
  mentorUnreadCount: number;
  mentor: {
    mentorName: string | null;
  };
};

const ChatRooms = ({ room }: { room: Room }) => {
  const mentorUnreadCountToZeroMutation =
    api.chatRoom.mentorUnreadCountToZero.useMutation();

  // Function to get initials from name
  const getInitials = (name: string | null) => {
    if (!name) return "S";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Function to handle chat navigation
  const navigateToChat = async () => {
    await mentorUnreadCountToZeroMutation.mutateAsync({ chatRoomId: room.id });
    window.location.href = `/mentor-dashboard/inbox?mId=${room.student.studentId}`;
  };        

  return (
    <div
      className="overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md"
      onClick={navigateToChat}
    >
      <div className="flex cursor-pointer items-center gap-4 p-4">
        {/* Avatar */}
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          {getInitials(room.student.studentName)}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="font-medium text-gray-900">
              {room.student.studentName || "Student"}
            </h3>
            {room.mentorUnreadCount > 0 && (
              <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-medium text-white">
                {room.mentorUnreadCount}
              </span>
            )}
          </div>
          <p className="truncate text-sm text-gray-600">{room.lastMessage}</p>
        </div>

        <div className="ml-2 flex-shrink-0">
          <MessageSquare className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Action button */}
      <div className="border-t border-gray-100 bg-gray-50 px-4 py-2">
        <button
          onClick={navigateToChat}
          className="flex w-full items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Open Chat
        </button>
      </div>
    </div>
  );
};

export default ChatRooms;
