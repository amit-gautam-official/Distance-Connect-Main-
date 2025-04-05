"use client";
import React from "react";
import { api } from "@/trpc/react";

type Room = {
  id: string;
  student: {
    studentName: string | null;
    id : string | null;
  };
  mentor: {
    mentorName: string | null;
    id: string | null;
  };
  lastMessage: string;
  studentUnreadCount: number;
};

const ChatRoom = ({
  room,
  selectedChatRoom,
  setSelectedChatRoom,
}: {
  room: Room;
  selectedChatRoom: Room | null;
  setSelectedChatRoom: (room: Room) => void;
}) => {
  const studentUnreadCountToZeroMutation =
    api.chatRoom.studentUnreadCountToZero.useMutation();

  // Truncate long messages
  const truncateMessage = (message: string) => {
    const maxLength = 30;
    return message.length > maxLength
      ? message.substring(0, maxLength) + "..."
      : message;
  };

  // Format the mentor's initial for the avatar
  const getMentorInitial = () => {
    if (!room.mentor.mentorName) return "M";
    const nameParts = room.mentor.mentorName.split(" ");
    if (nameParts.length > 1 && nameParts[0] && nameParts[1]) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`;
    }
    return room.mentor.mentorName.charAt(0);
  };

  return (
    <button
      onClick={async () => {
        await studentUnreadCountToZeroMutation.mutateAsync({
          chatRoomId: room.id,
        });
        setSelectedChatRoom(room);
      }}
      style={{
        borderLeft:
          selectedChatRoom?.id === room.id
            ? "4px solid #3b82f6" // blue-500
            : "4px solid transparent",
        backgroundColor:
          selectedChatRoom?.id === room.id
            ? "#eff6ff" // blue-50
            : "transparent",
      }}
      className="w-full px-3 py-3 text-left transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none active:bg-gray-100 sm:px-4 sm:py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 sm:h-12 sm:w-12">
            <span className="text-sm font-medium sm:text-base">
              {getMentorInitial()}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 sm:text-base">
              {room.mentor.mentorName || "Mentor"}
            </h3>
            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              {truncateMessage(room.lastMessage)}
            </p>
          </div>
        </div>

        {room.studentUnreadCount > 0 && (
          <span className="ml-2 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white sm:h-7 sm:w-7">
            {room.studentUnreadCount > 99 ? "99+" : room.studentUnreadCount}
          </span>
        )}
      </div>
    </button>
  );
};

export default ChatRoom;
