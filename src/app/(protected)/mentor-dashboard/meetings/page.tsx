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
import { CalendarIcon, CheckCircle2, MessageSquare, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import Link from "next/link";



import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MeetingsSkeleton from "./components/MeetingsSkeleton";
import dynamic from "next/dynamic";
import StudentList from "../profile/components/StudentList";

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

interface Meeting {
  id: string;
  title: string;
  student: string | null;
  time: string;
  date: string;
  status: MeetingStatus;
  duration: number;
  meetUrl: string;
  completed: boolean;
  statusText: string;
  feedback?: string;
  starRating?: number;
}

const MeetingsPage = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("meetings");

  const utils = api.useUtils();
  const { data: mentor } = api.mentor.getMentorDataById.useQuery(undefined, {
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const { data, isLoading, isError } =
    api.scheduledMeetings.getScheduledMeetingsListByMentor.useQuery(undefined, {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    });

  const markMeetingCompleted =
    api.scheduledMeetings.markMeetingCompleted.useMutation({
      onSuccess: () => {
        utils.scheduledMeetings.getScheduledMeetingsListByMentor.invalidate();
        toast.success("Meeting marked as completed");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to mark meeting as completed");
      },
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
  const notStartedMeetings = filterMeetingList("upcoming")?.map(
    (item): Meeting => {
      return {
        id: item?.id,
        title: item?.eventName,
        student: item?.student?.studentName,
        time: item?.selectedTime,
        date: item?.formatedDate,
        status: "not-started" as MeetingStatus,
        duration: item?.duration,
        meetUrl: item?.meetUrl!,
        completed: item?.completed,
        feedback: item?.feedback || undefined,
        statusText: `Starting in: ${(() => {
          const timeDiff =
            new Date(item?.selectedDate).getTime() - new Date().getTime();
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          );
          const minutes = Math.floor(
            (timeDiff % (1000 * 60 * 60)) / (1000 * 60),
          );

          return `${days > 0 ? `${days} days, ` : ""}${hours > 0 ? `${hours} hours, ` : ""}${minutes} minutes`;
        })()}`,
      };
    },
  );

  const completedMeetings = filterMeetingList("completed")?.map(
    (item): Meeting => {
      return {
        id: item?.id,
        title: item?.eventName,
        student: item?.student?.studentName,
        time: item?.selectedTime,
        date: item?.formatedDate,
        status: "completed" as MeetingStatus,
        duration: item?.duration,
        meetUrl: item?.meetUrl!,
        completed: item?.completed,
        feedback: item?.feedback || undefined,
        starRating: item?.star || 0,
        statusText: "Completed",
      };
    },
  );

  const missedMeetings = filterMeetingList("missed")?.map((item): Meeting => {
    return {
      id: item?.id,
      title: item?.eventName,
      student: item?.student?.studentName,
      time: item?.selectedTime,
      date: item?.formatedDate,
      status: "missed" as MeetingStatus,
      duration: item?.duration,
      meetUrl: item?.meetUrl!,
      completed: item?.completed,
      feedback: item?.feedback || undefined,
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

  const studentsData = Array.from(
    new Set(
      mentor?.scheduledMeetings?.map((meeting) => meeting.student.id) || [],
    ),
  ).map((studentId) => {
    const meeting = mentor?.scheduledMeetings?.find(
      (m) => m.student.id === studentId,
    );
    return {
      id: meeting?.student.id ?? "",
      username : meeting?.student.user.username ?? "",
      studentUserId: meeting?.student.userId ?? "",
      name: meeting?.student.user.name ?? "",
      role: meeting?.student.user.role ?? "",
      instituteName: meeting?.student.institutionName ?? "",
      expertise: meeting?.student.interestFields ?? [],
      image: meeting?.student.user.image ?? "",
      isFollowing: false,
      rating: 4,
    };
  });

  const handleMarkCompleted = async (meetingId: string) => {
    try {
      await markMeetingCompleted.mutateAsync({ meetingId });
    } catch (error) {
      console.error("Error marking meeting as completed:", error);
    }
  };

  if (isLoading) {
    return <MeetingsSkeleton />;
  }

  if (isError) {
    return <div className="p-8">Error loading meetings. Please try again.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6">
      <Tabs
        defaultValue="meetings"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="meetings" className="text-sm sm:text-base">
            Meetings
          </TabsTrigger>
          <TabsTrigger value="students" className="text-sm sm:text-base">
            My Students
          </TabsTrigger>
        </TabsList>

        <div className="min-h-[500px] sm:min-h-[600px]">
          <TabsContent value="meetings" className="mt-4 sm:mt-6">
            <div className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Meeting History
                </h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="scheduled" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="scheduled">
                    Scheduled Meetings
                  </TabsTrigger>
                  <TabsTrigger value="history">Meeting History</TabsTrigger>
                </TabsList>

                <TabsContent value="scheduled">
                  <div className="grid gap-6 mb-20 md:mb-0">
                    {scheduledMeetings.length === 0 ? (
                      <div className="rounded-lg border p-6 text-center">
                        <p className="text-gray-500">
                          No scheduled meetings found.
                        </p>
                      </div>
                    ) : (
                      scheduledMeetings.map((meeting : any) => (
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
                                {meeting.student}
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
                              {meeting?.starRating && meeting.status === "completed" &&
                                meeting?.starRating > 0 && ( 
                                  <div className="mt-2 flex items-center">
                                    <span className="mr-2 text-xs text-gray-500">
                                      Rating:
                                    </span>
                                    <div className="flex">
                                      {meeting?.starRating ? [1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`h-3 w-3 ${
                                            star <= (meeting?.starRating!)
                                              ? "fill-yellow-400 text-yellow-400"
                                              : "text-gray-300"
                                          }`}
                                        />
                                      )) : 
                                        <span className="text-xs text-gray-500">
                                          No rating available
                                        </span>
                                    }
                                    </div>
                                  </div>
                                )}
                            </div>
                            <div className="border-t border-gray-100 px-3 py-2 sm:px-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center text-xs text-gray-500 sm:text-sm">
                                  <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full border border-gray-300">
                                    <span className="text-xs">⏱️</span>
                                  </span>
                                  Duration: {meeting.duration} minutes
                                </div>
                                <div className="flex items-center gap-2">
                                  {meeting.status === "missed" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleMarkCompleted(meeting.id)
                                      }
                                      className="h-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                                    >
                                      <CheckCircle2 className="mr-1 h-4 w-4" />
                                      Mark as Completed
                                    </Button>
                                  )}
                                  {meeting.status === "completed" &&
                                    meeting.feedback && (
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 text-black hover:bg-blue-50 hover:text-blue-700"
                                          >
                                            <MessageSquare className="mr-1 h-4 w-4" />
                                            View Feedback
                                          </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                          <DialogHeader>
                                            <DialogTitle>
                                              Meeting Feedback
                                            </DialogTitle>
                                            <DialogDescription>
                                              Feedback from {meeting.student}
                                            </DialogDescription>
                                          </DialogHeader>
                                          <div className="py-4">
                                            {meeting.starRating && (
                                              <div className="mb-4 flex items-center">
                                                <span className="mr-2 text-sm font-medium text-gray-700">
                                                  Rating:
                                                </span>
                                                <div className="flex">
                                                  {[1, 2, 3, 4, 5].map(
                                                    (star) => (
                                                      <Star
                                                        key={star}
                                                        className={`h-5 w-5 ${
                                                          star <=
                                                          (meeting.starRating ||
                                                            0)
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "text-gray-300"
                                                        }`}
                                                      />
                                                    ),
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                            <div className="rounded-md bg-gray-50 p-4">
                                              <p className="whitespace-pre-wrap text-sm text-gray-700">
                                                {meeting.feedback}
                                              </p>
                                            </div>
                                          </div>
                                        </DialogContent>
                                      </Dialog>
                                    )}
                                  {meeting.status === "completed" &&
                                    !meeting.feedback && (
                                      <div className="flex items-center text-sm text-gray-500">
                                        <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />
                                        Completed
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                            {meeting.status !== "completed" && (
                              <Link target="_blank" href={meeting.meetUrl}>
                                <Button className="w-full rounded-none bg-[#5580D6] py-2 text-xs text-white hover:bg-[#5580D6]/90 sm:text-sm">
                                  Join Now
                                </Button>
                              </Link>
                            )}
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="history">
                  <div className=" flex flex-col gap-4 sm:flex-row sm:items-end ">
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
                          <SelectItem value="not-started">
                            Not Started
                          </SelectItem>
                          <SelectItem value="missed">Missed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline" onClick={resetFilters}>
                      Reset
                    </Button>
                  </div>

                  <div className="rounded-md border mb-20 md:mb-0">
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
                                  {getStatusBadgeText(
                                    meeting.status as MeetingStatus,
                                  )}
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
          </TabsContent>

          <TabsContent value="students" className="mt-4 sm:mt-6 mb-20 md:mb-0">
            <StudentList studentsData={studentsData!} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default MeetingsPage;
