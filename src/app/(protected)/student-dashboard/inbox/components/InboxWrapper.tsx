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
  // Use a simple string ID to track the selected chat room
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<string | null>(
    null,
  );
  const [showSidebar, setShowSidebar] = useState(false);
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
    setShowSidebar(false); // Close sidebar on mobile after selection
  };

  // Calculate total unread messages
  const totalUnread = chatRooms.reduce(
    (sum, room) => sum + room.studentUnreadCount,
    0,
  );

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-gray-50 md:flex-row">
      {/* Mobile header with toggle button */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white p-3 md:hidden">
        <div className="flex items-center">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="mr-3 rounded-full p-1 text-gray-500 hover:bg-gray-100"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedChatRoom?.mentor.mentorName || "Select a conversation"}
          </h2>
        </div>
        {totalUnread > 0 && (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {totalUnread > 99 ? "99+" : totalUnread}
          </span>
        )}
      </div>

      {/* Sidebar with chat rooms - toggleable on mobile */}
      <div
        className={`absolute inset-0 z-20 w-full transform overflow-y-auto border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out md:static md:z-0 md:w-80 md:min-w-80 md:translate-x-0 ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Messages</h2>
            <p className="text-sm text-gray-500">Chat with your mentors</p>
          </div>
          <button
            onClick={() => setShowSidebar(false)}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 md:hidden"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>
        <ChatRooms
          selectedChatRoom={selectedChatRoom}
          chatRooms={chatRooms}
          setSelectedChatRoom={handleSelectChatRoom}
        />
      </div>

      {/* Overlay to close sidebar when clicking outside on mobile */}
      {showSidebar && (
        <div
          className="absolute inset-0 z-10 bg-black bg-opacity-50 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main chat area */}
      <div className="flex flex-1 flex-col overflow-hidden">
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
