"use client";
import Chat from "@/app/(protected)/chat/[chatRoomId]/_components/Chat";
import React, { useEffect, useState, useRef } from "react";
import ChatRooms from "./ChatRooms";
import { api } from "@/trpc/react";
import { ChevronLeft } from "lucide-react";
import { AblyProvider, ChannelProvider } from "ably/react";
import * as Ably from "ably";

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
  chatRooms: initialChatRooms,
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
  // Maintain local state of chat rooms to update when new messages arrive
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(
    // Sort initial chat rooms by unread count
    [...initialChatRooms].sort(
      (a, b) => b.studentUnreadCount - a.studentUnreadCount,
    ),
  );

  // Find the selected chat room object based on the ID
  const selectedChatRoom =
    chatRooms.find((room) => room.id === selectedChatRoomId) || null;

  // Fetch mentor details when mId is provided
  const { data: mentorData } = api.mentor.getMentorByUserId.useQuery(
    { userId: mId },
    {
      enabled: !!mId,
      retry: 1,
    },
  );

  // Set the initial chat room when the component mounts
  useEffect(() => {
    if (chatRooms.length > 0 && chatRooms[0]) {
      setSelectedChatRoomId(chatRooms[0].id);
    }
  }, [chatRooms]);

  // Only fetch messages when we have a valid chatRoomId
  const { data: messages, refetch: refetchMessages } =
    api.chat.getMessages.useQuery(
      { chatRoomId: selectedChatRoomId || "" },
      {
        enabled: !!selectedChatRoomId,
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
    api.chatRoom.getChatRoomByMentorAndStudentId.useQuery(
      { mentorUserId: mId },
      {
        enabled: !!mId,
      },
    );

  const newRoomMutation = api.chatRoom.createChatRoom.useMutation({
    onSuccess: (data) => {
      setSelectedChatRoomId(data.id);
    },
  });

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

  // Mark message as read when chat room is selected
  const markAsReadMutation =
    api.chatRoom.studentUnreadCountToZero.useMutation();

  useEffect(() => {
    // If we have a default room, select it
    if (defaultRoom) {
      setSelectedChatRoomId(defaultRoom.id);
      hasCreatedRoom.current = true;
    }
    // If we don't have a default room, mId is provided, query is done loading,
    // and we haven't already tried to create a room
    else if (mId && !isLoadingDefaultRoom && !hasCreatedRoom.current) {
      hasCreatedRoom.current = true;
      newRoomMutation.mutate({
        mentorUserId: mId,
      });
    }
  }, [defaultRoom, mId, isLoadingDefaultRoom]);

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

          // Only increase unread count if the message is not from the student
          const newUnreadCount =
            message.senderRole !== "STUDENT" && roomId !== selectedChatRoomId
              ? room.studentUnreadCount + 1
              : room.studentUnreadCount;

          return {
            ...room,
            lastMessage: messageText,
            studentUnreadCount: newUnreadCount,
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
        return b.studentUnreadCount - a.studentUnreadCount;
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

  // Handle chat room selection
  const handleSelectChatRoom = (room: ChatRoom) => {
    setSelectedChatRoomId(room.id);
    setShowChatView(true);

    // Mark messages as read when selecting a chat room
    if (room.studentUnreadCount > 0) {
      markAsReadMutation.mutate({ chatRoomId: room.id });

      // Update local state to reflect messages have been read
      setChatRooms((currentRooms) =>
        currentRooms.map((currentRoom) =>
          currentRoom.id === room.id
            ? { ...currentRoom, studentUnreadCount: 0 }
            : currentRoom,
        ),
      );
    }
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
    <div className="flex h-screen w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white md:flex-row">
      {/* Mobile header - only shows on mobile */}
      <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white p-3 md:hidden">
        {showChatView ? (
          <div className="flex w-full items-center justify-between">
            <button
              onClick={handleBackToList}
              className="flex items-center text-gray-600 focus:outline-none"
              aria-label="Back to chat list"
            >
              <ChevronLeft className="mr-1 h-5 w-5" />
              <span className="font-medium">Back</span>
            </button>
            <h2 className="text-lg font-semibold text-gray-800">
              {mId && mentorData?.mentorName
                ? mentorData.mentorName
                : selectedChatRoom?.mentor.mentorName || ""}
            </h2>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
            {totalUnread > 0 && (
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                {totalUnread > 99 ? "99+" : totalUnread}
              </span>
            )}
          </>
        )}
      </div>

      {/* Chat list - left sidebar (always visible on desktop, conditional on mobile) */}
      <div
        className={`h-[calc(100vh-3.5rem)] w-full overflow-hidden border-r border-gray-200 bg-gray-50 md:flex md:h-screen md:w-80 md:flex-col ${
          showChatView ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Desktop header - only shows on desktop */}
        <div className="hidden items-center justify-between border-b border-gray-200 p-4 md:flex">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Messages</h2>
            <p className="text-sm text-gray-500">Chat with your mentors</p>
          </div>
        </div>

        {/* Chat rooms list - scrollable */}
        <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex-1 overflow-y-auto">
          <ChatRooms
            selectedChatRoom={selectedChatRoom}
            chatRooms={chatRooms}
            setSelectedChatRoom={handleSelectChatRoom}
          />
        </div>
      </div>

      {/* Chat view - right side (always visible on desktop, conditional on mobile) */}
      <div
        className={`flex h-[calc(100vh-3.5rem)] flex-1 flex-col overflow-hidden md:h-screen ${
          showChatView ? "flex" : "hidden md:flex"
        }`}
      >
        {/* Show mentor name in chat view on desktop */}
        <div className="hidden h-14 items-center border-b border-gray-200 px-4 md:flex">
          <h2 className="text-lg font-semibold text-gray-800">
            {mId && mentorData?.mentorName
              ? mentorData.mentorName
              : selectedChatRoom?.mentor.mentorName || "Select a conversation"}
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
                      // This ensures local messages are reflected immediately
                      updateChatRoomWithNewMessage(
                        {
                          ...message,
                          // Ensure we have the correct sender role
                          senderRole: "STUDENT",
                        },
                        selectedChatRoomId,
                      );

                      // Reset unread count when sending a message
                      if (selectedChatRoom?.studentUnreadCount) {
                        markAsReadMutation.mutate({
                          chatRoomId: selectedChatRoomId,
                        });

                        // Update local state to reflect messages have been read
                        setChatRooms((currentRooms) =>
                          currentRooms.map((currentRoom) =>
                            currentRoom.id === selectedChatRoomId
                              ? { ...currentRoom, studentUnreadCount: 0 }
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
