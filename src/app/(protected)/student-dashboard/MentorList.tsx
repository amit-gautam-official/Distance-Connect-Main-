"use client";
import React from "react";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const MentorList = () => {
  const { data, isError, isLoading } = api.mentor.getAllMentorsForStudent.useQuery(undefined,
    {
      // Reduce retries to avoid rate limit issues
      retry: 1,
      // Increase staleTime to reduce refetches
      staleTime: 10 * 60 * 1000, // 10 minutes
    },
  );

  return (
    <div className="container mx-auto p-6">
      {isLoading && (
        <div className="text-center text-lg text-gray-600">Loading...</div>
      )}
      {isError && (
        <div className="text-center text-lg text-red-500">
          Error loading mentors.
        </div>
      )}
      {data &&
        data.map((mentor) => {
          // Map events to a simpler format
          const events = mentor.meetingEvents?.map((event) => ({
            id: event.id,
            eventName: event.eventName,
          }));

          return (
            <Card
              key={mentor.userId}
              className="mb-6 shadow transition hover:shadow-lg"
            >
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">
                  <a
                    href={`/${mentor.userId}`}
                    className="text-blue-600 hover:underline"
                  >
                    {mentor.mentorName}
                  </a>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-gray-700">
                    <span className="font-semibold">Job Title:</span>{" "}
                    {mentor.jobTitle}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Company:</span>{" "}
                    {mentor.currentCompany}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Experience:</span>{" "}
                    {mentor.experience} years
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Industry:</span>{" "}
                    {mentor.industry}
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold text-gray-800">
                    Meeting Events
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {events?.map((event) => (
                      <Badge
                        key={event.id}
                        className="cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
                      >
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href={`/${mentor.userId}/${event.id}`}
                        >
                          {event.eventName}
                        </a>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
};

export default MentorList;
