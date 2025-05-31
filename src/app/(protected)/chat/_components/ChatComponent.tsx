"use client";

import { useState, useEffect, Suspense } from "react";
import ContactList from "@/components/chat/contact-list";
import ChatWindow from "@/components/chat/chat-window";
import { useMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { api } from "@/trpc/react";
import { AblyProvider, ChannelProvider } from "ably/react";
import * as Ably from "ably";
import { useSearchParams } from 'next/navigation';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex h-full items-center justify-center">
    <div className="loader">Loading...</div>
  </div>
);

type Contact = {
  id: string;
  mentor: {
    id: string;
    mentorName: string | null;
    user: {
      image: string | null;
      name: string | null;
    };
  };
  student: {
    id: string;
    studentName: string | null;
    user: {
      image: string | null;
      name: string | null;
    };
  };
  lastMessage: string;
  mentorUnreadCount: number;
  studentUnreadCount: number;
  createdAt: Date;
  updatedAt: Date;
};

type ChatContentProps = {
  client: Ably.Realtime | null;
  chatRooms: Contact[];
  setChatRooms: React.Dispatch<React.SetStateAction<Contact[]>>;
  selectedChatRoom: Contact | undefined;
  setSelectedChatRoom: React.Dispatch<React.SetStateAction<Contact | undefined>>;
  userRole: "MENTOR" | "STUDENT" | "USER" | "STARTUP";
  showChat: boolean;
  setShowChat: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
};

// Wrap the chat content with suspense boundaries
function ChatContent({
  client,
  chatRooms,
  setChatRooms,
  selectedChatRoom,
  setSelectedChatRoom,
  userRole,
  showChat,
  setShowChat,
  isMobile
}: ChatContentProps) {
  const userQuery = api.user.getMe.useQuery();
  const studentUnreadCountToZero = api.chatRoom.studentUnreadCountToZero.useMutation();
  const mentorUnreadCountToZero = api.chatRoom.mentorUnreadCountToZero.useMutation();
  
  const handleSelectChat = (chatRoomId: string) => {
    setChatRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === chatRoomId ? { ...room, mentorUnreadCount: 0 } : room
      )
    );
    
    const selectedRoom = chatRooms.find((room) => room.id === chatRoomId);
    if (selectedRoom) {
      setSelectedChatRoom(selectedRoom);
    }

    if (userRole === "MENTOR") {
      mentorUnreadCountToZero.mutate({ chatRoomId });
    } else if (userRole === "STUDENT") {
      studentUnreadCountToZero.mutate({ chatRoomId });
    }

    if (isMobile) {
      setShowChat(true);
    }
  };

  return (
    <>
      {/* Contacts panel */}
      {(!isMobile || !showChat) && (
        <div className="w-full border-r border-gray-200 bg-white md:w-1/3">
          <ContactList
            chatRooms={chatRooms}
            selectedChatRoom={selectedChatRoom?.id || ''}
            onSelectChat={handleSelectChat}
            showDashboardButton={true}
            userRole={userRole}
          />
        </div>
      )}

      {/* Chat panel */}
      {(!isMobile || showChat) && (
        <div className="flex w-full flex-col md:w-2/3">
          {selectedChatRoom && client ? (
            <AblyProvider client={client}>
              <ChannelProvider channelName={selectedChatRoom.id}>
                <ChatWindow
                  showChat={showChat}
                  setShowChat={setShowChat}
                  chatRoom={selectedChatRoom}
                  userRole={userRole}
                  userId={userQuery.data?.id || ''}
                  onMessageSent={(message) => {
                    setChatRooms((prevRooms) =>
                      prevRooms.map((room) =>
                        room.id === selectedChatRoom.id
                          ? { 
                              ...room, 
                              lastMessage: message?.message || '', 
                              updatedAt: new Date() 
                            }
                          : room
                      )
                    );
                  }}
                />
              </ChannelProvider>
            </AblyProvider>
          ) : (
            <div className="flex flex-1 items-center justify-center text-gray-500">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default function ChatCompo() {
  const [selectedChatRoom, setSelectedChatRoom] = useState<Contact | undefined>(undefined);
  const [chatRooms, setChatRooms] = useState<Contact[]>([]);
  const isMobile = useMobile();
  const [showChat, setShowChat] = useState(!isMobile);
  const [userRole, setUserRole] = useState<"MENTOR" | "STUDENT" | "USER" | "STARTUP">("USER");
  const [client, setClient] = useState<Ably.Realtime | null>(null);
  const searchParams = useSearchParams();
 
  const mentorId = searchParams?.get('mentorId');
  const studentId = searchParams?.get('studentId');

  const userQuery = api.user.getMe.useQuery();
  const chatRoomsQuery = api.chatRoom.getChatRoomByBackendId.useQuery();
  
  const createChatRoomMutation = api.chatRoom.createChatRoomByMentorId.useMutation({
    onSuccess: (data) => {
      if ('mentor' in data && 'student' in data) {
        setSelectedChatRoom(data as Contact);
        setChatRooms((prevRooms) => [...prevRooms, data as Contact]);
      } else {
        const transformedData: Contact = {
          id: data.id,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          lastMessage: data.lastMessage,
          mentorUnreadCount: data.mentorUnreadCount,
          studentUnreadCount: data.studentUnreadCount,
          mentor: {
            id: data.mentorUserId,
            mentorName: null,
            user: {
              image: null,
              name: null
            }
          },
          student: {
            id: data.studentUserId,
            studentName: null,
            user: {
              image: null,
              name: null
            }
          }
        };
        setSelectedChatRoom(transformedData);
        setChatRooms((prevRooms) => [...prevRooms, transformedData]);
      }
    },
  });

  // Only run these queries when we have the necessary parameters
  const getChatRoomByBothIdQuery = api.chatRoom.getChatRoomByBothId.useQuery(
    { mentorUserId: mentorId || '' },
    { enabled: !!mentorId }
  );
    
  const getChatRoomByBothId2Query = api.chatRoom.getChatRoomByBothId2.useQuery(
    { studentId: studentId || '' },
    { enabled: !!studentId }
  );

  // Initialize Ably client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const ablyClient = new Ably.Realtime({
        authUrl: "/api/ably",
        autoConnect: true,
      });
      setClient(ablyClient);

      return () => {
        ablyClient.close();
      };
    }
  }, []);

  // Handle user role
  useEffect(() => {
    if (userQuery.status === "success" && userQuery.data?.role) {
      setUserRole(userQuery.data.role as "MENTOR" | "STUDENT" | "USER" | "STARTUP");
    }
  }, [userQuery.status, userQuery.data]);

  // Handle chat rooms
  useEffect(() => {
    if (chatRoomsQuery.status === "success" && chatRoomsQuery.data) {
      setChatRooms(chatRoomsQuery.data);
    }
  }, [chatRoomsQuery.status, chatRoomsQuery.data]);

  // Handle mentor ID and student ID params
  useEffect(() => {
    // For mentor ID
    if (mentorId && getChatRoomByBothIdQuery.status === "success") {
      if (getChatRoomByBothIdQuery.data) {
        setSelectedChatRoom(getChatRoomByBothIdQuery.data);
      } else if (mentorId) {
        createChatRoomMutation.mutate({ mentorUserId: mentorId });
      }
    }
    
    // For student ID
    if (studentId && getChatRoomByBothId2Query.status === "success") {
      if (getChatRoomByBothId2Query.data) {
        setSelectedChatRoom(getChatRoomByBothId2Query.data);
      }
    }
  }, [
    mentorId, 
    studentId, 
    getChatRoomByBothIdQuery.status, 
    getChatRoomByBothIdQuery.data,
    getChatRoomByBothId2Query.status, 
    getChatRoomByBothId2Query.data,
    createChatRoomMutation
  ]);

  // Handle mobile/desktop view
  useEffect(() => {
    if (!isMobile) {
      setShowChat(true);
    } else {
      setShowChat(!!selectedChatRoom);
    }
  }, [isMobile, selectedChatRoom]);

  // Show loading state while chat rooms are loading
  if (chatRoomsQuery.status === "pending") {
    return <LoadingFallback />;
  }

  return (
    <div className="flex h-[100dvh] bg-gray-50">
      <Suspense fallback={<LoadingFallback />}>
        <ChatContent
          client={client}
          chatRooms={chatRooms}
          setChatRooms={setChatRooms}
          selectedChatRoom={selectedChatRoom}
          setSelectedChatRoom={setSelectedChatRoom}
          userRole={userRole}
          showChat={showChat}
          setShowChat={setShowChat}
          isMobile={isMobile}
        />
      </Suspense>
    </div>
  );
}