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
  const { data: student } = api.student.getStudent.useQuery(undefined, {
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
  console.log("student", student);

  const { data, isLoading, isError } =
    api.scheduledMeetings.getScheduledMeetingsListByStudent.useQuery(
      undefined,
      {
        retry: 1,
        staleTime: 5 * 60 * 1000,
      },
    );

  // Split meetings into upcoming and expired based on the current date/time.
  // Adjust this logic as  needed (for example, consider the meeting time if needed).

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
  console.log("upcoming", filterMeetingList("upcoming"));
  console.log("expired", filterMeetingList("expired"));

  // Mock data for scheduled meetings
  const notStartedMeetings = filterMeetingList("upcoming")?.map((item) => {
    return {
      id: item?.id,
      title: item?.eventName,
      mentor: item?.mentor?.mentorName,
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
      mentor: item?.mentor?.mentorName,
      time: item?.selectedTime,
      date: item?.formatedDate,
      status: "completed" as MeetingStatus,
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

  const missedMeetings = filterMeetingList("missed")?.map((item) => {
    return {
      id: item?.id,
      title: item?.eventName,
      mentor: item?.mentor?.mentorName,
      time: item?.selectedTime,
      date: item?.formatedDate,
      status: "missed" as MeetingStatus,
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

  const scheduledMeetings = [
    ...(notStartedMeetings || []),
    ...(completedMeetings || []),
    ...(missedMeetings || []),
  ];

  console.log("scheduledMeetings", scheduledMeetings);
  console.log("completedMeetings", completedMeetings);
  console.log("missedMeetings", missedMeetings);
  console.log("notStartedMeetings", notStartedMeetings);

  // Mock data for meeting history

  const meetingHistory = scheduledMeetings.map((item) => {
    return {
      id: item?.id || "",
      mentor: item?.mentor || "",
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
    // Expected format: "DD MMM YYYY" (e.g., "04 Sep 2019")
    const parsedDate = parse(dateStr, "dd MMM yyyy", new Date());
    return isValid(parsedDate) ? parsedDate : null;
  };

  // Filter meeting history based on selected filters
  const filteredMeetingHistory = useMemo(() => {
    return meetingHistory.filter((meeting) => {
      // Date filter
      if (date) {
        const meetingDate = parseMeetingDate(meeting.date);
        if (
          !meetingDate ||
          meetingDate.getDate() !== date.getDate() ||
          meetingDate.getMonth() !== date.getMonth() ||
          meetingDate.getFullYear() !== date.getFullYear()
        ) {
          return false;
        }
      }

      // Keyword search (case insensitive)
      if (
        searchKeyword &&
        !(meeting.mentor || "")
          .toLowerCase()
          .includes(searchKeyword.toLowerCase()) &&
        !(meeting.topic || "")
          .toLowerCase()
          .includes(searchKeyword.toLowerCase()) &&
        !(meeting.id || "").toLowerCase().includes(searchKeyword.toLowerCase())
      ) {
        return false;
      }

      // Status filter
      if (
        statusFilter !== "all" &&
        (meeting.status || "").toLowerCase() !== statusFilter.toLowerCase()
      ) {
        return false;
      }

      return true;
    });
  }, [date, searchKeyword, statusFilter, meetingHistory]);

  return (
    <div className="container mx-auto p-2 sm:p-6">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between md:mb-6">
        <h1 className="mb-2 text-2xl font-bold sm:mb-0 md:text-3xl">
          Meetings
        </h1>
        <div className="rounded-md bg-gray-100 p-2">
          <span className="text-gray-600">
            {format(new Date(), "dd - MM - yyyy")}
          </span>
        </div>
      </div>

      <Tabs defaultValue="scheduled" className="w-full">
        <TabsList className="mb-4 w-full justify-start overflow-x-auto border-b bg-transparent md:mb-8">
          <TabsTrigger
            value="scheduled"
            className="rounded-none px-4 pb-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500"
          >
            Scheduled Meeting
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-none px-4 pb-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-500"
          >
            Meeting History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {scheduledMeetings.map((meeting) => (
              <Card key={meeting.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-3 sm:p-4">
                    <div className="mb-2 flex items-center justify-start">
                      <Badge
                        className={`${getStatusBadgeColor(meeting.status)} text-xs font-normal hover:bg-gray-100 sm:text-sm`}
                      >
                        {getStatusBadgeText(meeting.status)}
                      </Badge>
                    </div>
                    <h3 className="mb-1 line-clamp-1 text-base font-semibold sm:text-lg">
                      {meeting.title}
                    </h3>
                    <p className="mb-2 text-xs text-gray-500 sm:text-sm">
                      {meeting.mentor}
                    </p>
                    <div className="mb-1 flex items-center text-xs text-gray-500 sm:text-sm">
                      <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full border border-gray-300">
                        <span className="text-xs">⏰</span>
                      </span>
                      {meeting.time}
                    </div>
                    <div className="mb-2 flex items-center text-xs text-gray-500 sm:text-sm">
                      <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full border border-gray-300">
                        <span className="text-xs">📅</span>
                      </span>
                      {meeting.date}
                    </div>
                    <p className="text-xs text-gray-500">
                      {meeting.statusText}
                    </p>
                  </div>
                  <div className="border-t border-gray-100 px-3 py-2 sm:px-4">
                    <div className="flex items-center text-xs text-gray-500 sm:text-sm">
                      <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full border border-gray-300">
                        <span className="text-xs">⏱️</span>
                      </span>
                      Duration: {meeting.duration} minutes
                    </div>
                  </div>
                  <Link target="_blank" href={meeting.meetUrl}>
                    <Button className="w-full rounded-none bg-black py-2 text-xs text-white hover:bg-gray-800 sm:text-sm">
                      Join Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="rounded-lg bg-white p-3 shadow sm:p-6">
            <div className="mb-4 flex flex-col gap-3 md:mb-6 md:flex-row md:justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left text-xs font-normal sm:w-[180px] sm:text-sm",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "dd MMM yyyy")
                      ) : (
                        <span>Select date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Keywords Search"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full text-xs sm:w-[200px] sm:text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full text-xs sm:w-[180px] sm:text-sm">
                    <SelectValue placeholder="Meeting Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="missed">Missed</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                className="flex items-center gap-2 text-xs sm:text-sm"
                onClick={resetFilters}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9z"></path>
                  <path d="M9 12h6"></path>
                  <path d="M12 9v6"></path>
                </svg>
                Reset Filter
              </Button>
            </div>

            <div className="-mx-3 overflow-x-auto sm:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">
                      MENTOR NAME
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm">TOPIC</TableHead>
                    <TableHead className="text-xs sm:text-sm">DATE</TableHead>
                    <TableHead className="text-xs sm:text-sm">STATUS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMeetingHistory.length > 0 ? (
                    filteredMeetingHistory.map((meeting) => (
                      <TableRow key={meeting.id}>
                        <TableCell className="text-xs sm:text-sm">
                          {meeting.mentor}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          {meeting.topic}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm">
                          {meeting.date}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              meeting.status === "completed" ||
                              meeting.status === "not-started" ||
                              meeting.status === "ongoing" ||
                              meeting.status === "missed"
                                ? getStatusBadgeColor(meeting.status)
                                : "bg-gray-200 text-gray-700"
                            } text-xs font-normal sm:text-sm`}
                          >
                            {meeting.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-4 text-center text-xs text-gray-500 sm:text-sm"
                      >
                        No meetings found matching the selected filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MeetingsPage;
