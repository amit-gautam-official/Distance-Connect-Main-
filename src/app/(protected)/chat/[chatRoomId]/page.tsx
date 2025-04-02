import { api } from "@/trpc/server";
import React from "react";
import Chat from "./_components/Chat";
import { db } from "@/server/db";
import { auth0 } from "@/lib/auth0";
import dynamic from "next/dynamic";

type Params = Promise<{ chatRoomId: string }>;

// Create a client-side only wrapper for the chat with Ably providers
const ChatWithProviders = dynamic(
  () => import("./_components/ChatWithProviders"),
  { ssr: false },
);

const page = async ({ params }: { params: Params }) => {
  const session = await auth0.getSession();
  const userId = session?.user.sub;

  const { chatRoomId } = await params;

  const initialMessages = await api.chat.getMessages({ chatRoomId });
  //console.log("initialMessages", initialMessages)

  return (
    <div>
      <ChatWithProviders
        chatRoomId={chatRoomId}
        initialMessages={initialMessages ?? []}
        userId={userId!}
      />
    </div>
  );
};

export default page;
