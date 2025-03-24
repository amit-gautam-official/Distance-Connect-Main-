"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScheduledMeetingList from "./_components/ScheduledMeetingList";
import { format } from "date-fns";
import { api } from "@/trpc/react";

function ScheduledMeeting() {
  const {
    data: scheduledMeetingsListByMentorList,
    isLoading,
    isError,
  } = api.scheduledMeetings.getScheduledMeetingsListByMentor.useQuery(
    undefined,
    {
      // Reduce retries to avoid rate limit issues
      retry: 1,
      // Increase staleTime to reduce refetches
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );

  const filterMeetingList = (type: string) => {
    const currentTimestamp = new Date().getTime();
    if (type == "upcoming") {
      return scheduledMeetingsListByMentorList?.filter(
        (item) => Number(item?.formatedTimeStamp) >= Number(currentTimestamp),
      );
    } else {
      return scheduledMeetingsListByMentorList?.filter(
        (item) => Number(item?.formatedTimeStamp) < Number(currentTimestamp),
      );
    }
  };
  //console.log(new Date())

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold">Scheduled Meetings</h2>
      <hr className="my-5"></hr>
      {isLoading && <div>Loading...</div>}
      <Tabs defaultValue="upcoming" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <ScheduledMeetingList meetingList={filterMeetingList("upcoming")!} />{" "}
        </TabsContent>
        <TabsContent value="expired">
          <ScheduledMeetingList meetingList={filterMeetingList("expired")!} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ScheduledMeeting;
