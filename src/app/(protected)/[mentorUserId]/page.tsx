"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/react";
import Link from "next/link";
import React from "react";
import { use } from "react";

type Params = Promise<{ mentorUserId: string }>;

const page = async ({ params }: { params: Params }) => {
  const { mentorUserId } = use(params);

  const { data: chatRoom } =
    api.chatRoom.getChatRoomByMentorAndStudentId.useQuery(
      { mentorUserId },
      {
        // Reduce retries to avoid rate limit issues
        retry: 1,
        // Increase staleTime to reduce refetches
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    );
  const { data: mentor, isLoading } = api.mentor.getMentorByUserId.useQuery(
    {
      userId: mentorUserId,
    },
    {
      // Reduce retries to avoid rate limit issues
      retry: 1,
      // Increase staleTime to reduce refetches
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );
  const createChatRoomMutation = api.chatRoom.createChatRoom.useMutation({
    onSuccess: () => {
      //console.log("Chat Room Created")
    },
    onError: (error) => {
      //console.log("Error", error)
    },
  });
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            {mentor?.mentorName}
          </CardTitle>
          <p className="text-gray-500">
            {mentor?.jobTitle} at {mentor?.currentCompany}
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="font-medium">
              Experience: {mentor?.experience} years
            </p>
            <p className="font-medium">Industry: {mentor?.industry}</p>
          </div>
          <div className="mb-4">
            <h3 className="mb-2 font-semibold">Hiring Fields</h3>
            <div className="flex flex-wrap gap-2">
              {mentor?.hiringFields.map((field) => (
                <Badge key={field} className="bg-blue-500 text-white">
                  {field}
                </Badge>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h3 className="mb-2 font-semibold">Meeting Events</h3>
            <ul className="list-inside list-disc text-gray-700">
              {mentor?.meetingEvents.map((event) => (
                <Link href={`${mentorUserId}/${event?.id}`} key={event.id}>
                  {event.eventName}
                </Link>
              ))}
            </ul>
          </div>
          <Button
            className="mt-6"
            onClick={async () => {
              //console.log("chatRoom", chatRoom);
              if (!chatRoom) {
                const chatRoom = await createChatRoomMutation.mutateAsync({
                  mentorUserId,
                });
                //console.log("chatRoom", chatRoom);
                return (window.location.href = `chat/${chatRoom?.id}`);
              }
              //console.log("chatRoom", chatRoom);
              return (window.location.href = `chat/${chatRoom?.id}`);
            }}
          >
            Chat
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
