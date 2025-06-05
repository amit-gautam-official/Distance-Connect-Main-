"use client";

import { useState, useMemo } from "react";
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
import { 
  CalendarIcon, 
  Download, 
  Loader2, 
  Clock, 
  Users, 
  Gift, 
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// Define types for the meeting log data based on Prisma schema
type MeetingLog = {
  id: string;
  eventName: string;
  selectedTime: string;
  formatedDate: string;
  selectedDate: Date;
  paymentStatus: boolean;
  createdAt: Date;
  isFirstSession: boolean;
  studentId: string;
  mentorId: string;
  duration?: number;
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

type PaginationData = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

// Statistics Card Component
const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description,
  className = ""
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  className?: string;
}) => (
  <Card className={className}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
    </CardContent>
  </Card>
);

export default function MeetingLogsContent() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [exportLoading, setExportLoading] = useState(false);

  // Fetch paginated meeting logs from the server
  const { data: meetingLogsData, isLoading } = api.admin.getMeetingLogs.useQuery({
    page: currentPage,
    limit: itemsPerPage,
    date: date,
    status: statusFilter !== "all" ? statusFilter as "paid" | "failed" : undefined
  });

  // Fetch export data separately (only when needed)
  const {
    data: exportData,
    refetch: refetchExportData,
    isLoading: isExportDataLoading
  } = api.admin.getMeetingLogsForExport.useQuery(
    {
      date: date,
      status: statusFilter !== "all" ? statusFilter as "paid" | "failed" : undefined
    },
    {
      enabled: false, // Only fetch when explicitly requested
    }
  );
  
  const meetingLogs = meetingLogsData?.meetings || [];
  const pagination = meetingLogsData?.pagination;

  // Reset to first page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    handleFilterChange();
  };

  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    handleFilterChange();
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    if (pagination) {
      setCurrentPage(Math.max(1, Math.min(page, pagination.totalPages)));
    }
  };

  // Calculate statistics based on export data or current page data
  const statistics = useMemo(() => {
    // Use export data if available for accurate statistics, otherwise use current page data
    const dataForStats = exportData || meetingLogs;
    
    if (!dataForStats || dataForStats.length === 0) {
      return {
        totalMinutes: 0,
        totalSessions: 0,
        totalFreeSessions: 0,
        conversionRate: 0,
        paidSessions: 0
      };
    }

    const totalSessions = dataForStats.filter(log => log.paymentStatus).length;
    const totalFreeSessions = dataForStats.filter(log => log.isFirstSession).length;
    const paidSessions = dataForStats.filter(log => !log.isFirstSession && log.paymentStatus).length;
    
    const totalMinutes = dataForStats.reduce((total, log) => {
      return total + (log.duration || 60);
    }, 0);

    const conversionRate = totalFreeSessions > 0 ? Math.round((paidSessions / totalFreeSessions) * 100) : 0;

    return {
      totalMinutes,
      totalSessions,
      totalFreeSessions,
      conversionRate,
      paidSessions
    };
  }, [exportData, meetingLogs]);

  // Function to export meeting logs as CSV
  const handleExportCSV = async () => {
    setExportLoading(true);

    try {
      // Fetch all data for export
      const result = await refetchExportData();
      const logsToExport = result.data || [];

      if (logsToExport.length === 0) {
        console.log("No data to export");
        return;
      }

      // Create CSV content
      const headers = [
        "Meeting ID", 
        "Student", 
        "Student ID", 
        "Mentor", 
        "Mentor ID", 
        "Event Name", 
        "Date", 
        "Time", 
        "Status", 
        "Duration (min)"
      ];

      const csvContent = [
        headers.join(","),
        ...logsToExport.map(log => [
          log.id,
          log.student?.studentName || "Unknown Student",
          log.studentId || "-",
          log.mentor?.mentorName || "Unknown Mentor",
          log.mentorId || "-",
          log.eventName,
          log.formatedDate,
          log.selectedTime,
          log.isFirstSession ? "First Session" : (log.paymentStatus ? "Paid" : "Failed"),
          log.duration || 60
        ].map(field => 
          // Escape fields that contain commas, quotes, or newlines
          typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))
            ? `"${field.replace(/"/g, '""')}"` 
            : field
        ).join(","))
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
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Meeting Minutes"
          value={statistics.totalMinutes.toLocaleString()}
          icon={Clock}
          description={`Avg: ${statistics.totalSessions > 0 ? Math.round(statistics.totalMinutes / statistics.totalSessions) : 0} min/session`}
        />
        <StatCard
          title="Total Sessions"
          value={statistics.totalSessions}
          icon={Users}
          description={`${statistics.paidSessions} paid, ${statistics.totalFreeSessions} free`}
        />
        <StatCard
          title="Free Sessions"
          value={statistics.totalFreeSessions}
          icon={Gift}
          description="First-time student sessions"
        />
        <StatCard
          title="Conversion Rate"
          value={`${statistics.conversionRate}%`}
          icon={TrendingUp}
          description="Free to paid sessions"
          className={statistics.conversionRate >= 50 ? "border-green-200 bg-green-50" : statistics.conversionRate >= 25 ? "border-yellow-200 bg-yellow-50" : ""}
        />
      </div>

      {/* Meeting Logs Table */}
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
                    onSelect={handleDateChange}
                    initialFocus
                  />
                  {date && (
                    <div className="border-t p-3">
                      <Button 
                        variant="ghost" 
                        className="w-full" 
                        onClick={() => handleDateChange(undefined)}
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
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              {/* Items per page */}
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Export button and pagination info */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {pagination && (
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, pagination.totalCount)} of {pagination.totalCount} logs
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={handleExportCSV}
                disabled={isLoading || exportLoading || isExportDataLoading}
              >
                {exportLoading || isExportDataLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Export CSV
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : meetingLogs && meetingLogs.length > 0 ? (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead className="hidden sm:table-cell">Student ID</TableHead>
                      <TableHead>Mentor</TableHead>
                      <TableHead className="hidden sm:table-cell">Mentor ID</TableHead>
                      <TableHead className="hidden md:table-cell">Event Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="hidden sm:table-cell">Time</TableHead>
                      <TableHead className="hidden md:table-cell">Duration</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {meetingLogs.map(log => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">
                          <div>
                            {log.student?.studentName || "Unknown Student"}
                          </div>
                          <div className="text-xs text-gray-500 sm:hidden">
                            ID: {log.studentId || "-"}
                          </div>
                        </TableCell>
                        <TableCell className="hidden text-xs text-gray-500 sm:table-cell">
                          {log.studentId || "-"}
                        </TableCell>
                        <TableCell>
                          <div>
                            {log.mentor?.mentorName || "Unknown Mentor"}
                          </div>
                          <div className="text-xs text-gray-500 sm:hidden">
                            ID: {log.mentorId || "-"}
                          </div>
                        </TableCell>
                        <TableCell className="hidden text-xs text-gray-500 sm:table-cell">
                          {log.mentorId || "-"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {log.eventName}
                        </TableCell>
                        <TableCell>
                          <div>{log.formatedDate}</div>
                          <div className="text-xs text-gray-500 sm:hidden">
                            {log.selectedTime}
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {log.selectedTime}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm text-muted-foreground">
                            {log.duration || 60} min
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            log.isFirstSession
                              ? "bg-blue-100 text-blue-800" 
                              : log.paymentStatus 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {log.isFirstSession 
                              ? "First" 
                              : log.paymentStatus 
                                ? "Paid" 
                                : "Failed"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {pagination.totalPages}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1 || isLoading}
                      className="flex items-center gap-1"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => goToPage(pageNum)}
                            disabled={isLoading}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages || isLoading}
                      className="flex items-center gap-1"
                    >
                      Next
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </>
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
                    setCurrentPage(1);
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}