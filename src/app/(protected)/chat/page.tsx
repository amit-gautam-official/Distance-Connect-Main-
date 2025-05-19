"use client";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
const ContactList = dynamic(() => import("@/components/chat/contact-list"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});
const ChatWindow = dynamic(() => import("@/components/chat/chat-window"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});
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
  const [userRole, setUserRole] = useState<"MENTOR" | "STUDENT" | "USER" | "STARTUP" | "ADMIN">("USER");
  const [error, setError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [client, setClient] = useState<Ably.Realtime | null>(null);
  const searchParams = useSearchParams()
  const router = useRouter();
 
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
      // Ensure data has the expected structure before setting it as selectedChatRoom
      const chatRoomData = data as unknown as Contact;
      setSelectedChatRoom(chatRoomData);
      setChatRooms((prevRooms) => [...(prevRooms || []), chatRoomData]);
      setError(null);
    },
    onError: (err) => {
      console.error("Chat creation error:", err);
      setError(err.message || "Could not create chat room");
      
      // If the error is about booking a meeting, we'll add a timer to redirect to offerings
      if (err.message.includes("book a meeting") && mentorId) {
        setIsRedirecting(true);
        setTimeout(() => {
          router.push(`/mentors/${mentorId}/offerings`);
        }, 5000);
      }
    }
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
          setError(null);
        }
        if (!getChatRoomByBothIdQuery.data && !error) {
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
          {error ? (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 rounded-full bg-red-100 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">Unable to start chat</h3>
              <p className="mb-4 text-gray-600">{error}</p>
              {isRedirecting && (
                <div className="mb-4">
                  <p className="text-sm text-blue-600">Redirecting you to booking page in a few seconds...</p>
                  <div className="mt-2 h-1 w-full rounded-full bg-gray-200">
                    <div className="h-1 animate-pulse rounded-full bg-blue-600" style={{ width: '100%' }}></div>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <Link href="/student-dashboard/mentors" className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                  Find Mentors
                </Link>
                {mentorId && (
                  <Link href={`/mentors/${mentorId}/offerings`} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    Book a Session
                  </Link>
                )}
              </div>
            </div>
          ) : selectedChatRoom ? (
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
