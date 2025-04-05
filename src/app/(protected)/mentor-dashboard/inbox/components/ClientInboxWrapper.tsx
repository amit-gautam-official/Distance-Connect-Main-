"use client";

import dynamic from "next/dynamic";
import React from "react";

// Use dynamic import in this client component wrapper
const InboxWrapper = dynamic(() => import("./InboxWrapper"), {
  ssr: false, // Now this is safe as we're in a client component
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
    </div>
  ),
});

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

const ClientInboxWrapper = ({
  chatRooms,
  userId,
  sId,
}: {
  chatRooms: ChatRoom[];
  userId: string;
  sId: string;
}) => {
  return <InboxWrapper chatRooms={chatRooms} userId={userId} sId={sId} />;
};

export default ClientInboxWrapper;
