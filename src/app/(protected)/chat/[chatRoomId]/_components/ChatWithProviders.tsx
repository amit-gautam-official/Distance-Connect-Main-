"use client";

import React, { useEffect, useState } from "react";
import Chat from "./Chat";
import { AblyProvider, ChannelProvider } from "ably/react";
import * as Ably from "ably";

type InitialMessage = {
  message: string | null;
  type: string;
  id: string;
  senderId?: string;
  createdAt: Date;
  senderRole: string;
  imagePath: string | null;
  imageUrl?: string;
  fileName?: string | null;
};

export default function ChatWithProviders({
  chatRoomId,
  initialMessages,
  userId,
  onMessageSent,
}: {
  chatRoomId: string;
  initialMessages: InitialMessage[];
  userId: string;
  onMessageSent?: (message: any) => void;
}) {
  const [client, setClient] = useState<Ably.Realtime | null>(null);

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

  if (!client) {
    return <div className="p-4">Connecting to chat...</div>;
  }

  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName={chatRoomId}>
        <Chat
          chatRoomId={chatRoomId}
          initialMessages={initialMessages}
          userId={userId}
          onMessageSent={onMessageSent}
        />
      </ChannelProvider>
    </AblyProvider>
  );
}
