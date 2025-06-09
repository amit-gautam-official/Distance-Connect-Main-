"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { JsonValue } from "@prisma/client/runtime/library";
import Link from "next/link";
import { api } from "@/trpc/react";
import { type ScheduledMeetings } from "@prisma/client";
import { useDebounce } from "@/hooks/use-debounce";

interface Mentor {
  user: {
    id: string;
    username: string | null;
    email: string;
    image: string | null;
  };
  userId: string;
  industry: string | null;
  linkedinUrl: string | null;
  currentCompany: string | null;
  mentorName: string | null;
  verified: boolean;
  wholeExperience: JsonValue[];
  companyEmailVerified: boolean;
  companyEmail: string | null;
  mentorTier: string | null;
  mentorSessionPriceRange: string | null;
  tierReasoning: string | null;
  mentorPhoneNumber?: string | null; 
  scheduledMeetings ?: {
    id: string;
    isFreeSession: boolean;
  }[] | null; // Optional field for scheduled meetings
  };


interface MentorManagementProps {
  handleVerify: (mentor: Mentor) => void;
}

export default function MentorManagement({
  handleVerify,
}: MentorManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [verificationFilter, setVerificationFilter] = useState<"all" | "verified" | "unverified">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Debounce search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch paginated mentors
  const { 
    data: mentorData, 
    isLoading, 
    error 
  } = api.admin.getMentorsForAdmin.useQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearchQuery,
    verified: verificationFilter,
  });

  // Fetch all mentors for export (only when needed)
  const { 
    data: exportMentors, 
    refetch: refetchExportData,
    isFetching: isExporting 
  } = api.admin.getMentorsForExport.useQuery({
    search: debouncedSearchQuery,
    verified: verificationFilter,
  }, {
    enabled: false, // Only fetch when explicitly called
  });

  const mentors = mentorData?.mentors || [];
  const pagination = mentorData?.pagination;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, verificationFilter, itemsPerPage]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleFilterChange = (value: "all" | "verified" | "unverified") => {
    setVerificationFilter(value);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
  };

  const goToPage = (page: number) => {
    if (pagination) {
      setCurrentPage(Math.max(1, Math.min(page, pagination.totalPages)));
    }
  };

  const exportToCSV = async () => {
    try {
      // Fetch all filtered data for export
      const { data } = await refetchExportData();
      
      if (!data) {
        console.error("No data available for export");
        return;
      }

      // Prepare CSV headers
      const headers = [
        'Mentor Name',
        'Username',
        'Email',
        'Industry',
        'Current Company',
        'LinkedIn URL',
        'Company Email',
        'Verified Status',
        'Company Email Verified',
        'Mentor Tier',
        'Price Range',
        'Tier Reasoning',
        'Phone Number'
      ];

      // Prepare CSV data
      const csvData = data.map(mentor => [
        mentor.mentorName || '',
        mentor.user.username || '',
        mentor.user.email || '',
        mentor.industry || '',
        mentor.currentCompany || '',
        mentor.linkedinUrl || '',
        mentor.companyEmail || '',
        mentor.verified ? 'Verified' : 'Pending',
        mentor.companyEmailVerified ? 'Yes' : 'No',
        mentor.mentorTier || '',
        mentor.mentorSessionPriceRange || '',
        mentor.tierReasoning || '',
        mentor.mentorPhoneNumber || ''
      ]);

      // Convert to CSV format
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          row.map(field => 
            // Escape fields that contain commas, quotes, or newlines
            typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))
              ? `"${field.replace(/"/g, '""')}"` 
              : field
          ).join(',')
        )
      ].join('\n');

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `mentors_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading mentors: {error.message}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()} 
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center md:mb-6">
        <h2 className="text-xl font-semibold md:text-2xl">Mentor Management</h2>
        <Button 
          onClick={exportToCSV}
          variant="outline"
          className="flex items-center gap-2"
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          Export to CSV {pagination && `(${pagination.totalCount} items)`}
        </Button>
      </div>

      <div className="mb-4 flex flex-col gap-4 md:mb-6">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
            size={18}
          />
          <Input
            className="pl-10"
            placeholder="Search mentors..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Select
              value={verificationFilter}
              onValueChange={handleFilterChange}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Mentors</SelectItem>
                <SelectItem value="verified">Verified Only</SelectItem>
                <SelectItem value="unverified">Unverified Only</SelectItem>
              </SelectContent>
            </Select>

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

          {pagination && (
            <div className="text-sm text-gray-600">
              Showing {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.totalCount)} of {pagination.totalCount} mentors
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden sm:table-cell">Phone</TableHead>
                <TableHead className="hidden md:table-cell">
                  Profile
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Session Stats
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    Loading mentors...
                  </TableCell>
                </TableRow>
              ) : mentors.length > 0 ? (
                mentors.map((mentor) => (
                  <TableRow key={mentor.userId}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {mentor.user.image && (
                          <img
                            src={mentor.user.image}
                            alt={mentor.mentorName || "Mentor"}
                            className="h-8 w-8 rounded-full"
                          />
                        )}
                        <div>{mentor.mentorName}</div>
                      </div>

                      <div className="mt-1 text-xs text-gray-500 sm:hidden">
                        {mentor.user.email}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {mentor.user.email}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {mentor.mentorPhoneNumber || "N/A"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/mentors/${mentor.user.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Mentor Profile
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div>
                        <span className="font-semibold text-green-600" >
                          Free Sessions : {mentor?.scheduledMeetings?.filter(meeting => meeting.isFreeSession).length || 0}
                        </span>
                        <br />
                        <span className="font-semibold text-violet-600">
                          Paid Sessions : {mentor?.scheduledMeetings?.filter(
                            (meeting) => meeting.isFreeSession === false
                          ).length || 0 }
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {mentor.verified ? (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-orange-500 text-orange-500 "
                        >
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => handleVerify(mentor)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No mentors found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(pagination.page - 1)}
              disabled={!pagination.hasPreviousPage || isLoading}
              className="flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {/* Show page numbers */}
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={pagination.page === pageNum ? "default" : "outline"}
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
              onClick={() => goToPage(pagination.page + 1)}
              disabled={!pagination.hasNextPage || isLoading}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}