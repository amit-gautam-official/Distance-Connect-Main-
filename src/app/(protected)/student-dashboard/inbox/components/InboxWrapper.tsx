"use client";
import Chat from "@/app/(protected)/chat/[chatRoomId]/_components/Chat";
import React, { useEffect, useState, useRef } from "react";
import ChatRooms from "./ChatRooms";
import { api } from "@/trpc/react";
import { Menu, X } from "lucide-react";

interface ChatRoom {
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

const InboxWrapper = ({
  chatRooms,
  userId,
  mId,
}: {
  chatRooms: ChatRoom[];
  userId: string;
  mId: string;
}) => {
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<string | null>(
    null,
  );
  const [showChatView, setShowChatView] = useState(false);
  const hasCreatedRoom = useRef(false);

  // Find the selected chat room object based on the ID
  const selectedChatRoom =
    chatRooms.find((room) => room.id === selectedChatRoomId) || null;

  // Set the initial chat room when the component mounts
  useEffect(() => {
    if (chatRooms.length > 0 && chatRooms[0]) {
      console.log("Setting initial chat room:", chatRooms[0].id);
      setSelectedChatRoomId(chatRooms[0].id);
    }
  }, [chatRooms]);

  // Only fetch messages when we have a valid chatRoomId
  const { data: messages } = api.chat.getMessages.useQuery(
    { chatRoomId: selectedChatRoomId || "" },
    {
      // Only run the query when we have a valid chatRoomId
      enabled: !!selectedChatRoomId,
      // Retry fewer times to avoid rate limit issues
      retry: 1,
    },
  );

  const { data: defaultRoom, isLoading: isLoadingDefaultRoom } =
    api.chatRoom.getChatRoomByMentorAndStudentId.useQuery(
      { mentorUserId: mId },
      {
        // Only run this query when mId is provided
        enabled: !!mId,
      },
    );

  const newRoomMutation = api.chatRoom.createChatRoom.useMutation({
    onSuccess: (data) => {
      console.log("Created new room:", data.id);
      setSelectedChatRoomId(data.id);
    },
  });

  useEffect(() => {
    // If we have a default room, select it
    if (defaultRoom) {
      console.log("Setting default room:", defaultRoom.id);
      setSelectedChatRoomId(defaultRoom.id);
      hasCreatedRoom.current = true; // Mark that we have a room
    }
    // If we don't have a default room, mId is provided, query is done loading,
    // and we haven't already tried to create a room
    else if (mId && !isLoadingDefaultRoom && !hasCreatedRoom.current) {
      hasCreatedRoom.current = true; // Mark that we're creating a room to prevent duplicates
      newRoomMutation.mutate({
        mentorUserId: mId,
      });
    }
  }, [defaultRoom, mId, isLoadingDefaultRoom]);

  // Handle chat room selection
  const handleSelectChatRoom = (room: ChatRoom) => {
    console.log("Selecting chat room:", room.id);
    setSelectedChatRoomId(room.id);
    setShowChatView(true);
  };

  // Handle back to chat list
  const handleBackToList = () => {
    setShowChatView(false);
  };

  // Calculate total unread messages
  const totalUnread = chatRooms.reduce(
    (sum, room) => sum + room.studentUnreadCount,
    0,
  );

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-gray-50">
      {/* Mobile header with back button and title */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white p-3 md:hidden">
        <div className="flex items-center">
          {showChatView ? (
            <button
              onClick={handleBackToList}
              className="mr-3 rounded-full p-1 text-gray-500 hover:bg-gray-100"
              aria-label="Back to chat list"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          ) : null}
          <h2 className="text-lg font-semibold text-gray-800">
            {showChatView ? selectedChatRoom?.mentor.mentorName : "Messages"}
          </h2>
        </div>
        {totalUnread > 0 && !showChatView && (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {totalUnread > 99 ? "99+" : totalUnread}
          </span>
        )}
      </div>

      {/* Chat list view - shown by default on mobile */}
      <div
        className={`h-full w-full md:w-80 md:min-w-80 md:border-r md:border-gray-200 ${showChatView ? "hidden md:block" : "block"}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Messages</h2>
              <p className="text-sm text-gray-500">Chat with your mentors</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ChatRooms
              selectedChatRoom={selectedChatRoom}
              chatRooms={chatRooms}
              setSelectedChatRoom={handleSelectChatRoom}
            />
          </div>
        </div>
      </div>

      {/* Chat view - shown when a chat is selected on mobile */}
      <div
        className={`h-full flex-1 ${showChatView ? "block" : "hidden md:block"}`}
      >
        <Chat
          chatRoomId={selectedChatRoomId || ""}
          initialMessages={messages || []}
          userId={userId}
        />
      </div>
    </div>
  );
};

export default InboxWrapper;
