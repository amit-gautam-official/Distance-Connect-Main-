"use client";

import React, { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isValid, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import Link from "next/link";

type MeetingStatus = "not-started" | "ongoing" | "completed" | "missed";
type HistoryStatus = "Completed" | "Pending" | "Rejected";
type DateFilterType =
  | "all"
  | "Feb"
  | "May"
  | "Jul"
  | "Aug"
  | "Sep"
  | "Nov"
  | "Dec";

const MeetingsPage = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: mentor } = api.mentor.getMentorDataById.useQuery(undefined, {
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const { data, isLoading, isError } =
    api.scheduledMeetings.getScheduledMeetingsListByMentor.useQuery(undefined, {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    });

  // Split meetings into upcoming, completed, and missed based on the current date/time.
  const filterMeetingList = (type: string) => {
    const currentTimestamp = new Date().getTime();
    if (type == "upcoming") {
      return data?.filter(
        (item) =>
          Number(item?.formatedTimeStamp) >= Number(currentTimestamp) &&
          !item?.completed,
      );
    } else if (type == "completed") {
      return data?.filter((item) => item?.completed);
    } else if (type == "missed") {
      return data?.filter(
        (item) =>
          Number(item?.formatedTimeStamp) < Number(currentTimestamp) &&
          !item?.completed,
      );
    }
  };

  // Process meetings for display
  const notStartedMeetings = filterMeetingList("upcoming")?.map((item) => {
    return {
      id: item?.id,
      title: item?.eventName,
      student: item?.student?.studentName,
      time: item?.selectedTime,
      date: item?.formatedDate,
      status: "not-started" as MeetingStatus,
      duration: item?.duration,
      meetUrl: item?.meetUrl,
      completed: item?.completed,
      statusText: `Starting in: ${(() => {
        const timeDiff =
          new Date(item?.selectedDate).getTime() - new Date().getTime();
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        return `${days > 0 ? `${days} days, ` : ""}${hours > 0 ? `${hours} hours, ` : ""}${minutes} minutes`;
      })()}`,
    };
  });

  const completedMeetings = filterMeetingList("completed")?.map((item) => {
    return {
      id: item?.id,
      title: item?.eventName,
      student: item?.student?.studentName,
      time: item?.selectedTime,
      date: item?.formatedDate,
      status: "completed" as MeetingStatus,
      duration: item?.duration,
      meetUrl: item?.meetUrl,
      completed: item?.completed,
      statusText: "Completed",
    };
  });

  const missedMeetings = filterMeetingList("missed")?.map((item) => {
    return {
      id: item?.id,
      title: item?.eventName,
      student: item?.student?.studentName,
      time: item?.selectedTime,
      date: item?.formatedDate,
      status: "missed" as MeetingStatus,
      duration: item?.duration,
      meetUrl: item?.meetUrl,
      completed: item?.completed,
      statusText: "Missed",
    };
  });

  const scheduledMeetings = [
    ...(notStartedMeetings || []),
    ...(completedMeetings || []),
    ...(missedMeetings || []),
  ];

  // Meeting history
  const meetingHistory = scheduledMeetings.map((item) => {
    return {
      id: item?.id || "",
      student: item?.student || "",
      topic: item?.title || "",
      date: item?.date || "",
      status: item?.status || ("Completed" as HistoryStatus),
    };
  });

  // Function to get status badge color
  const getStatusBadgeColor = (status: MeetingStatus) => {
    switch (status) {
      case "not-started":
        return "bg-gray-200 text-gray-700";
      case "ongoing":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "missed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  // Function to get status badge text
  const getStatusBadgeText = (status: MeetingStatus) => {
    switch (status) {
      case "not-started":
        return "Not started";
      case "ongoing":
        return "Ongoing";
      case "completed":
        return "Completed";
      case "missed":
        return "Missed";
      default:
        return "Unknown";
    }
  };

  // Function to get history status badge color
  const getHistoryStatusBadgeColor = (status: HistoryStatus) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-blue-100 text-blue-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setDate(undefined);
    setSearchKeyword("");
    setStatusFilter("all");
  };

  // Parse date string to Date object
  const parseMeetingDate = (dateStr: string): Date | null => {
    const parsedDate = parse(dateStr, "dd MMM yyyy", new Date());
    return isValid(parsedDate) ? parsedDate : null;
  };

  // Filter meeting history based on selected filters
  const filteredMeetingHistory = useMemo(() => {
    return meetingHistory.filter((meeting) => {
      // Filter by date
      if (date) {
        const meetingDate = parseMeetingDate(meeting.date);
        if (!meetingDate) return false;
        const filterDate = date;

        if (
          meetingDate.getDate() !== filterDate.getDate() ||
          meetingDate.getMonth() !== filterDate.getMonth() ||
          meetingDate.getFullYear() !== filterDate.getFullYear()
        ) {
          return false;
        }
      }

      // Filter by search keyword
      if (searchKeyword && searchKeyword.length > 0) {
        const keyword = searchKeyword.toLowerCase();
        if (
          !meeting.student.toLowerCase().includes(keyword) &&
          !meeting.topic.toLowerCase().includes(keyword)
        ) {
          return false;
        }
      }

      // Filter by status
      if (statusFilter !== "all") {
        if (meeting.status !== statusFilter) {
          return false;
        }
      }

      return true;
    });
  }, [meetingHistory, date, searchKeyword, statusFilter]);

  if (isLoading) {
    return <div className="p-8">Loading meetings...</div>;
  }

  if (isError) {
    return <div className="p-8">Error loading meetings. Please try again.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold">Meetings</h1>

      <Tabs defaultValue="scheduled" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="scheduled">Scheduled Meetings</TabsTrigger>
          <TabsTrigger value="history">Meeting History</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled">
          <div className="grid gap-6">
            {scheduledMeetings.length === 0 ? (
              <div className="rounded-lg border p-6 text-center">
                <p className="text-gray-500">No scheduled meetings found.</p>
              </div>
            ) : (
              scheduledMeetings.map((meeting) => (
                <Card key={meeting.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {meeting.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          With: {meeting.student}
                        </p>
                      </div>
                      <Badge
                        className={cn(
                          "ml-0 mt-2 sm:ml-auto sm:mt-0",
                          getStatusBadgeColor(meeting.status),
                        )}
                      >
                        {getStatusBadgeText(meeting.status)}
                      </Badge>
                    </div>
                    <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">Date & Time</p>
                        <p className="text-sm text-gray-500">
                          {meeting.date} at {meeting.time}
                        </p>
                        <p className="text-sm text-gray-500">
                          Duration: {meeting.duration} minutes
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {meeting.status === "not-started" && (
                          <p className="text-sm font-medium text-blue-600">
                            {meeting.statusText}
                          </p>
                        )}
                        {meeting.status === "not-started" && (
                          <Link href={meeting.meetUrl || "#"} target="_blank">
                            <Button className="w-full sm:w-auto">
                              Join Meeting
                            </Button>
                          </Link>
                        )}
                        {meeting.status === "completed" && (
                          <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                            disabled
                          >
                            Meeting Completed
                          </Button>
                        )}
                        {meeting.status === "missed" && (
                          <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                            disabled
                          >
                            Meeting Missed
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex flex-1 flex-col gap-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search by student or topic"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal sm:w-[240px]",
                      !date && "text-gray-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="sm:w-[180px]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="missed">Missed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Topic</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMeetingHistory.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-gray-500"
                    >
                      No meeting history found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMeetingHistory.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell>{meeting.student}</TableCell>
                      <TableCell>{meeting.topic}</TableCell>
                      <TableCell>{meeting.date}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            getStatusBadgeColor(
                              meeting.status as MeetingStatus,
                            ),
                          )}
                        >
                          {getStatusBadgeText(meeting.status as MeetingStatus)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MeetingsPage;
