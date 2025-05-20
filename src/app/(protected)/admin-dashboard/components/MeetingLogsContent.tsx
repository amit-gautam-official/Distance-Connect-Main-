"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Download, Loader2 } from "lucide-react";

// Define types for the meeting log data based on Prisma schema
type MeetingLog = {
  id: string;
  eventName: string;
  selectedTime: string;
  formatedDate: string;
  selectedDate: Date;
  paymentStatus: boolean;
  createdAt: Date;
  isFirstSession: boolean; // Added field to track if this is the student's first session
  studentId: string; // Added field for direct access to student ID
  mentorId: string; // Added field for direct access to mentor ID
  student: {
    studentName: string | null;
    userId: string;
    hasUsedFreeSession?: boolean;
  };
  mentor: {
    mentorName: string | null;
    userId: string;
  };
};

// Type assertion function for type safety
const isMeetingLog = (data: unknown): data is MeetingLog[] => {
  return Array.isArray(data) && data.every(item => 
    typeof item === 'object' && 
    item !== null && 
    'id' in item && 
    'eventName' in item && 
    'student' in item && 
    'mentor' in item && 
    'isFirstSession' in item
  );
};

export default function MeetingLogsContent() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [exportLoading, setExportLoading] = useState(false);

  // Fetch meeting logs from the server
  const { data: meetingLogsData, isLoading } = api.admin.getMeetingLogs.useQuery({
    date: date,
    status: statusFilter !== "all" ? statusFilter as "paid" | "pending" : undefined
  });
  
  // Safely cast the data to our expected type
  const meetingLogs = isMeetingLog(meetingLogsData) ? meetingLogsData : [];

  // Function to export meeting logs as CSV
  const handleExportCSV = () => {
    if (!meetingLogs || meetingLogs.length === 0) return;
    
    setExportLoading(true);

    try {
      // Create CSV content
      const headers = ["Meeting ID", "Student", "Student ID", "Mentor", "Mentor ID", "Event Name", "Date", "Time", "Status"];
      const csvContent = [
        headers.join(","),
        ...meetingLogs.map(log => [
          log.id,
          log.student?.studentName || "Unknown Student",
          log.studentId || "-",
          log.mentor?.mentorName || "Unknown Mentor",
          log.mentorId || "-",
          log.eventName,
          log.formatedDate,
          log.selectedTime,
          log.isFirstSession ? "First Session" : (log.paymentStatus ? "Paid" : "Pending")
        ].join(","))
      ].join("\n");

      // Create download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `meeting-logs-${format(new Date(), "yyyy-MM-dd")}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting CSV:", error);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meeting Booking Logs</CardTitle>
        <CardDescription>
          Track all meeting bookings between students and mentors
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Date filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left sm:w-[240px]">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Filter by date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
                {date && (
                  <div className="border-t p-3">
                    <Button 
                      variant="ghost" 
                      className="w-full" 
                      onClick={() => setDate(undefined)}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            
            {/* Status filter */}
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Export button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={handleExportCSV}
            disabled={isLoading || !meetingLogs || meetingLogs.length === 0 || exportLoading}
          >
            {exportLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export CSV
          </Button>
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : meetingLogs && meetingLogs.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Mentor</TableHead>
                  <TableHead>Mentor ID</TableHead>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meetingLogs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      {log.student?.studentName || "Unknown Student"}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {log.studentId || "-"}
                    </TableCell>
                    <TableCell>
                      {log.mentor?.mentorName || "Unknown Mentor"}
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {log.mentorId || "-"}
                    </TableCell>
                    <TableCell>{log.eventName}</TableCell>
                    <TableCell>{log.formatedDate}</TableCell>
                    <TableCell>{log.selectedTime}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        log.isFirstSession
                          ? "bg-blue-100 text-blue-800" 
                          : log.paymentStatus 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {log.isFirstSession 
                          ? "First Session" 
                          : log.paymentStatus 
                            ? "Paid" 
                            : "Pending"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">No meeting logs found</p>
            {(date || statusFilter !== "all") && (
              <Button 
                variant="link" 
                className="mt-2 h-auto p-0"
                onClick={() => {
                  setDate(undefined);
                  setStatusFilter("all");
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
