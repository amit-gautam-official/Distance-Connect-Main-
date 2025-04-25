"use client";

import { useState, useEffect } from "react";
import ContactList from "@/components/chat/contact-list";
import ChatWindow from "@/components/chat/chat-window";
import { useMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { api } from "@/trpc/react";
import { AblyProvider, ChannelProvider } from "ably/react";
import * as Ably from "ably";

import { useSearchParams } from 'next/navigation'




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

export default function ChatPage() {
  const [selectedChatRoom, setSelectedChatRoom] = useState<Contact>();
  const [chatRooms, setChatRooms] = useState<Contact[]>();
  const isMobile = useMobile();
  const [showChat, setShowChat] = useState(!isMobile);
  const [userRole, setUserRole] = useState<
    "MENTOR" | "STUDENT" | "USER" | "STARTUP"
  >("USER");

  const [client, setClient] = useState<Ably.Realtime | null>(null);
  const searchParams = useSearchParams()
 
  const mentorId = searchParams?.get('mentorId')
  const studentId = searchParams?.get('studentId')


  useEffect(() => {
    // Initialize Ably client on the client side
    if (typeof window !== "undefined") {
      const ablyClient = new Ably.Realtime({
        authUrl: "/api/ably",
        autoConnect: true,
      });
      setClient(ablyClient);

      

      // Cleanup on unmount
      return () => {
        ablyClient.close();
      };
    }
  }, []);

  const userQuery = api.user.getMe.useQuery();

  const chatRoomsQuery = api.chatRoom.getChatRoomByBackendId.useQuery();

  const createChatRoomMutation = api.chatRoom.createChatRoomByMentorId.useMutation({
    onSuccess: (data) => {
      setSelectedChatRoom(data);
      setChatRooms((prevRooms) => [...(prevRooms || []), data]);
    },
  });


  
  const getChatRoomByBothIdQuery = api.chatRoom.getChatRoomByBothId.useQuery(
    { mentorUserId: mentorId! },);
  const getChatRoomByBothId2Query = api.chatRoom.getChatRoomByBothId2.useQuery(
    { studentId: studentId! },);


  const studentUnreadCountToZero =
    api.chatRoom.studentUnreadCountToZero.useMutation();
  const mentorUnreadCountToZero =
    api.chatRoom.mentorUnreadCountToZero.useMutation();

  useEffect(() => {
    if (chatRoomsQuery.status === "success") {
      setChatRooms(chatRoomsQuery.data);
      // console.log("Chat rooms:", chatRoomsQuery.data);
    }
    if(mentorId){
      if (getChatRoomByBothIdQuery.status === "success") {
        if(getChatRoomByBothIdQuery.data) {
          setSelectedChatRoom(getChatRoomByBothIdQuery.data);
        }
        if (!getChatRoomByBothIdQuery.data) {
          createChatRoomMutation.mutate({ mentorUserId: mentorId! });
        }
      }
    }
    if(studentId){
      if (getChatRoomByBothId2Query.status === "success") {
        if(getChatRoomByBothId2Query.data) {
          setSelectedChatRoom(getChatRoomByBothId2Query.data);
        }
        
    }
  }

  }, [chatRoomsQuery.status]);

  useEffect(() => {
    if (userQuery.status === "success" && userQuery.data?.role) {
      // console.log("User role:", userQuery.data.role);
      setUserRole(userQuery.data.role);
    }
  }, [userQuery.status]);

  useEffect(() => {
    // On desktop, always show both panels and select the first chat if none is selected
    if (!isMobile) {
      setShowChat(true);
    } else {
      // On mobile, if a chat is selected, show the chat panel
      setShowChat(!!selectedChatRoom);
    }
  }, [isMobile]);

  const handleSelectChat = (chatRoomId: string) => {
    setChatRooms((prevRooms) =>
      prevRooms?.map((room) =>
        room.id === chatRoomId ? { ...room, mentorUnreadCount: 0 } : room,
      ),
    );
    setSelectedChatRoom(chatRooms?.find((room) => room.id === chatRoomId));

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
    <div className="flex h-[100dvh] bg-gray-50">
      {/* Contacts panel */}
      {(!isMobile || !showChat) && (
        <div className="w-full border-r border-gray-200 bg-white md:w-1/3">
          {chatRoomsQuery.status === "pending" ? (
            <div className="flex h-full items-center justify-center">
              <div className="loader"> Loading...</div>
            </div>
          ) : (
            <ContactList
              chatRooms={chatRooms!}
              selectedChatRoom={selectedChatRoom?.id!}
              onSelectChat={handleSelectChat}
              showDashboardButton={true}
              userRole={userRole}
            />
          )}
        </div>
      )}

      {/* Chat panel */}
      {(!isMobile || showChat) && (
        <div className="flex w-full flex-col md:w-2/3">
          {selectedChatRoom ? (
            <AblyProvider client={client!}>
              <ChannelProvider channelName={selectedChatRoom.id}>
                <ChatWindow
                  showChat={showChat}
                  setShowChat={setShowChat}
                  chatRoom={selectedChatRoom}
                  userRole={userRole}
                  userId={userQuery.data?.id!}

                  onMessageSent={(message) => {
                    // In a real app, this would send the message to the backend
                    // console.log("Message sent:", message);
                    setChatRooms((prevRooms) =>
                      prevRooms?.map((room) =>
                        room.id === selectedChatRoom?.id
                          ? { ...room, lastMessage: message?.message!, updatedAt: new Date() }
                          : room,
                      ),
                    )
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
    </div>
  );
}
