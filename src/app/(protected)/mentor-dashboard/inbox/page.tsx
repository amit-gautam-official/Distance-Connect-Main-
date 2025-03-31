import { api } from "@/trpc/server";
import React from "react";
import InboxWrapper from "./components/InboxWrapper";
import { auth0 } from "@/lib/auth0";

type PageProps = {
  params?: any;
  searchParams?: any;
};

const page = async ({ searchParams }: PageProps) => {
  const sId = await searchParams?.sId || "";
  const session = await auth0.getSession();
  const user = session?.user;

  const chatRooms = await api.chatRoom.getChatRoomByMentorId();

  return (
    <div className="h-screen w-full bg-gray-50">
      <div className="container mx-auto h-full px-0">
        <InboxWrapper sId={sId} userId={user?.sub!} chatRooms={chatRooms} />
      </div>
    </div>
  );
};

export default page;
