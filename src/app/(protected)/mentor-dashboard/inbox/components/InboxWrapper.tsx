"use client";
import React, { useEffect, useState, useRef } from "react";
import ChatRooms from "./ChatRooms";
import { api } from "@/trpc/react";
import { Menu, X } from "lucide-react";
import Chat from "@/app/(protected)/chat/[chatRoomId]/_components/Chat";

import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";

interface ChatRoom {
  id: string;
  student: {
    studentName: string | null;
    id: string | null;
    user : {
      avatarUrl : string | null;
    }
  };
  lastMessage: string;
  mentorUnreadCount: number;
  mentor: {
    mentorName: string | null;
  };

}

const InboxWrapper = ({
  chatRooms: initialChatRooms,
  userId,
  sId,
}: {
  chatRooms: ChatRoom[];
  userId: string;
  sId: string;
}) => {
  // Use a simple string ID to track the selected chat room
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<string | null>(
    null,
  );
  const hasCreatedRoom = useRef(false);
  // Maintain local state of chat rooms to update when new messages arrive
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(
    // Sort initial chat rooms by unread count
    [...initialChatRooms].sort(
      (a, b) => b.mentorUnreadCount - a.mentorUnreadCount,
    ),
  );

  // Initialize Ably client only on the client side
  const [client, setClient] = useState<Ably.Realtime | null>(null);

  // Initialize Ably client on client-side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ablyClient = new Ably.Realtime({
        authUrl: "/api/ably",
        autoConnect: true,
      });
      setClient(ablyClient);

      // Cleanup function
      return () => {
        ablyClient.close();
      };
    }
  }, []);

  // Find the selected chat room object based on the ID
  const selectedChatRoom =
    chatRooms.find((room) => room.id === selectedChatRoomId) || null;

  // Fetch student details when sId is provided
  const { data: studentData } = api.student.getStudentByUserId.useQuery(
    { userId: sId },
    {
      enabled: !!sId,
      retry: 1,
    },
  );

  // Set the initial chat room when the component mounts
  useEffect(() => {
    if (sId && chatRooms.length > 0) {
      const currentChatroom = chatRooms.filter(
        (chatroom) => chatroom.student.id === sId,
      );
      console.log("Setting initial chat room:", currentChatroom[0]?.id);
      if (!currentChatroom[0]) return;
      setSelectedChatRoomId(currentChatroom[0]?.id);
    }
  }, [chatRooms]);

  // Only fetch messages when we have a valid chatRoomId
  const { data: messages, refetch: refetchMessages } =
    api.chat.getMessages.useQuery(
      { chatRoomId: selectedChatRoomId || "" },
      {
        // Only run the query when we have a valid chatRoomId
        enabled: !!selectedChatRoomId,
        // Retry fewer times to avoid rate limit issues
        retry: 1,
      },
    );

  // Refetch messages when chatRoomId changes
  useEffect(() => {
    if (selectedChatRoomId) {
      console.log("Fetching messages for room:", selectedChatRoomId);
      void refetchMessages();
    }
  }, [selectedChatRoomId, refetchMessages]);

  const { data: defaultRoom, isLoading: isLoadingDefaultRoom } =
    api.chatRoom.getChatRoomByStudentId.useQuery(
      { studentUserId: sId },
      {
        // Only run this query when sId is provided
        enabled: !!sId,
      },
    );

  const newRoomMutation = api.chatRoom.createChatRoomByStudentId.useMutation({
    onSuccess: (data) => {
      console.log("Created new room:", data.id);
      setSelectedChatRoomId(data.id);
    },
  });

  // Mark message as read when chat room is selected
  const markAsReadMutation = api.chatRoom.mentorUnreadCountToZero.useMutation();

  useEffect(() => {
    // If we have a default room, select it
    if (defaultRoom) {
      console.log("Setting default room:", defaultRoom.id);
      setSelectedChatRoomId(defaultRoom.id);
      hasCreatedRoom.current = true; // Mark that we have a room
    }
    // If we don't have a default room, sId is provided, query is done loading,
    // and we haven't already tried to create a room
    else if (sId && !isLoadingDefaultRoom && !hasCreatedRoom.current) {
      hasCreatedRoom.current = true; // Mark that we're creating a room to prevent duplicates
      newRoomMutation.mutate({
        studentUserId: sId,
      });
    }
  }, [defaultRoom, sId, isLoadingDefaultRoom]);

  // Handle chat room selection
  const handleSelectChatRoom = (room: ChatRoom) => {
    console.log("Selecting chat room:", room.id);
    setSelectedChatRoomId(room.id);

    // Mark messages as read when selecting a chat room
    if (room.mentorUnreadCount > 0) {
      markAsReadMutation.mutate({ chatRoomId: room.id });

      // Update local state to reflect messages have been read
      setChatRooms((currentRooms) =>
        currentRooms.map((currentRoom) =>
          currentRoom.id === room.id
            ? { ...currentRoom, mentorUnreadCount: 0 }
            : currentRoom,
        ),
      );
    }
  };

  // Calculate total unread messages
  const totalUnread = chatRooms.reduce(
    (sum, room) => sum + room.mentorUnreadCount,
    0,
  );

  // Handle new messages from Ably to update chat room list
  const updateChatRoomWithNewMessage = (message: any, roomId: string) => {
    console.log(
      "Updating chat room with new message:",
      message,
      "for room:",
      roomId,
    );

    setChatRooms((currentRooms) => {
      // Find the room that received the message
      const updatedRooms = currentRooms.map((room) => {
        if (room.id === roomId) {
          // Extract message text (handle image messages)
          const messageText =
            typeof message.message === "string"
              ? message.message
              : message.type === "IMAGE" || message.type === "image"
                ? "📷 Image"
                : "New message";

          console.log("Updating room:", room.id, "with message:", messageText);

          // Only increase unread count if the message is not from the mentor
          const newUnreadCount =
            message.senderRole !== "MENTOR" && roomId !== selectedChatRoomId
              ? room.mentorUnreadCount + 1
              : room.mentorUnreadCount;

          return {
            ...room,
            lastMessage: messageText,
            mentorUnreadCount: newUnreadCount,
          };
        }
        return room;
      });

      // Sort rooms to show the one with the most recent message at the top
      return [...updatedRooms].sort((a, b) => {
        // Room with the message that just arrived should be at the top
        if (a.id === roomId) return -1;
        if (b.id === roomId) return 1;

        // Otherwise sort by unread count
        return b.mentorUnreadCount - a.mentorUnreadCount;
      });
    });
  };

  // Message handler for Ably messages
  const handleMessage = (message: any) => {
    if (selectedChatRoomId) {
      updateChatRoomWithNewMessage(message.data, selectedChatRoomId);
    }
  };

  // Set up Ably listener for the currently selected chat room
  useEffect(() => {
    if (!selectedChatRoomId || !client) return;

    const channel = client.channels.get(selectedChatRoomId);
    channel.subscribe(handleMessage);

    return () => {
      channel.unsubscribe(handleMessage);
    };
  }, [selectedChatRoomId, client]);

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-gray-50 md:flex-row">
      {/* Mobile header with toggle button */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white p-3 md:hidden">
        <div className="flex items-center">
          {selectedChatRoomId ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedChatRoomId(null)}
                className="mr-2 rounded-full p-1 text-gray-500 hover:bg-gray-100"
                aria-label="Back to messages"
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
              <h2 className="text-lg font-semibold text-gray-800">
                {sId && studentData?.studentName
                  ? studentData.studentName
                  : selectedChatRoom?.student.studentName || "Messages"}
              </h2>
            </div>
          ) : (
          <div className="mb-[-20px]"></div>
          )}
        </div>
        {totalUnread > 0 && (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {totalUnread > 99 ? "99+" : totalUnread}
          </span>
        )}
      </div>

      {/* Sidebar with chat rooms - always visible but transforms on mobile */}
      <div
        className={`w-full overflow-y-auto border-r border-gray-200 bg-white transition-all duration-300 ease-in-out md:w-80 md:min-w-80 ${
          selectedChatRoomId ? "hidden md:block" : "block"
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Messages</h2>
            <p className="text-sm text-gray-500">Chat with your students</p>
          </div>
          <div className="md:hidden">
            {chatRooms.length > 0 && (
              <button
                onClick={() =>
                  chatRooms[0] && handleSelectChatRoom(chatRooms[0])
                }
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
                aria-label="Open first chat"
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
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <ChatRooms
          selectedChatRoom={selectedChatRoom}
          chatRooms={chatRooms}
          setSelectedChatRoom={handleSelectChatRoom}
        />
      </div>

      {/* Main chat area */}
      <div
        className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ease-in-out ${selectedChatRoomId ? "block" : "hidden md:block"}`}
      >
        {/* Desktop header */}
        <div className="sticky top-0 z-10 hidden items-center border-b border-gray-200 bg-white p-3 md:flex">
          <h2 className="text-lg font-semibold text-gray-800">
            {sId && studentData?.studentName
              ? studentData.studentName
              : selectedChatRoom?.student.studentName ||
                "Select a conversation"}
          </h2>
        </div>
        {/* Chat component - fills available space and handles its own scrolling */}
        <div className="flex-1 overflow-hidden">
          {client ? (
            <AblyProvider client={client}>
              <ChannelProvider channelName={selectedChatRoomId || ""}>
                <Chat
                  chatRoomId={selectedChatRoomId || ""}
                  initialMessages={messages || []}
                  userId={userId}
                  onMessageSent={(message) => {
                    if (selectedChatRoomId) {
                      // Directly update the chat room with the new message
                      updateChatRoomWithNewMessage(
                        {
                          ...message,
                          // Ensure we have the correct sender role
                          senderRole: "MENTOR",
                        },
                        selectedChatRoomId,
                      );

                      // Reset unread count when sending a message
                      if (selectedChatRoom?.mentorUnreadCount) {
                        markAsReadMutation.mutate({
                          chatRoomId: selectedChatRoomId,
                        });

                        // Update local state to reflect messages have been read
                        setChatRooms((currentRooms) =>
                          currentRooms.map((currentRoom) =>
                            currentRoom.id === selectedChatRoomId
                              ? { ...currentRoom, mentorUnreadCount: 0 }
                              : currentRoom,
                          ),
                        );
                      }
                    }
                  }}
                />
              </ChannelProvider>
            </AblyProvider>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">Connecting to chat service...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InboxWrapper;
