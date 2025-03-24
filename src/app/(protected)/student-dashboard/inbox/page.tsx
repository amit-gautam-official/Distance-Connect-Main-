import { api } from "@/trpc/server";
import React from "react";
import InboxWrapper from "./components/InboxWrapper";
import { auth0 } from "@/lib/auth0";

const page = async ({ searchParams }: { searchParams: { mId: string } }) => {
  const mId = searchParams?.mId || "";
  const session = await auth0.getSession();
  const user = session?.user;

  const chatRooms = await api.chatRoom.getChatRoomByStudentBackendId();




  return (
    <div className="h-screen w-full bg-gray-50">
      <div className="container mx-auto h-full px-0">
        <InboxWrapper
          mId={mId}
          userId={user?.sub!}
          chatRooms={chatRooms}
        />
      </div>
    </div>
  );
};

export default page;
