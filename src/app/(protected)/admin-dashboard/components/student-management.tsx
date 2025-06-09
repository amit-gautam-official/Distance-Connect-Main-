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
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/react"; // Adjust this import path as needed
import { useDebounce } from "@/hooks/use-debounce" // You may need to create this hook

interface Student {
  userId: string;
  studentName: string | null;
  studentRole: string | null;
  linkedinUrl: string | null;
  phoneNumber: string | null;
  user: {
    id: string;
    email: string;
    username: string | null;
    image: string | null;
  };
}

interface PaginationData {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function StudentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Debounce search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch paginated students
  const {
    data: studentsData,
    isLoading,
    error,
    refetch
  } = api.admin.getStudentsForAdmin.useQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearchQuery || undefined,
  });

  // Fetch all students for export
  const {
    data: exportData,
    refetch: refetchExportData,
    isLoading: isExportLoading
  } = api.admin.getStudentsForExport.useQuery(
    {
      search: debouncedSearchQuery || undefined,
    },
    {
      enabled: false, // Only fetch when explicitly requested
    }
  );

  const students = studentsData?.students || [];
  const pagination = studentsData?.pagination;

  // Reset to first page when search changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearchQuery]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
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

  const exportToCSV = async () => {
    try {
      // Fetch export data
      const result = await refetchExportData();
      const studentsToExport = result.data || [];

      // Prepare CSV headers
      const headers = [
        'Student Name',
        'Username',
        'Email',
        'Role',
        'LinkedIn URL',
        'Phone Number'
      ];

      // Convert students to CSV format
      const csvData = studentsToExport.map(student => [
        student.studentName || '',
        student.user.username || '',
        student.user.email || '',
        student.studentRole || '',
        student.linkedinUrl || '',
        student.phoneNumber || ''
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
      link.setAttribute('download', `students_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export students:', error);
      // You might want to show a toast notification here
    }
  };

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600">Error loading students: {error.message}</p>
        <Button onClick={() => refetch()} className="mt-2">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center md:mb-6">
        <h2 className="text-xl font-semibold md:text-2xl">Student Management</h2>
        <Button 
          onClick={exportToCSV}
          variant="outline"
          className="flex items-center gap-2"
          disabled={isExportLoading}
        >
          <Download size={16} />
          {isExportLoading ? 'Exporting...' : `Export to CSV ${pagination ? `(${pagination.totalCount} items)` : ''}`}
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
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, pagination.totalCount)} of {pagination.totalCount} students
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
                <TableHead className="hidden md:table-cell">Role</TableHead>
                <TableHead className="hidden md:table-cell">LinkedIn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading students...
                  </TableCell>
                </TableRow>
              ) : students.length > 0 ? (
                students.map((student) => (
                  <TableRow key={student.userId}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {student.user.image && (
                          <img
                            src={student.user.image}
                            alt={student.studentName || "Student"}
                            className="h-8 w-8 rounded-full"
                          />
                        )}
                        <div>{student.studentName || "N/A"}</div>
                      </div>

                      <div className="mt-1 text-xs text-gray-500 sm:hidden">
                        {student.user.email}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {student.user.email}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {student.phoneNumber || "N/A"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {student.studentRole ? (
                        <Badge variant="secondary">
                          {student.studentRole}
                        </Badge>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {student.linkedinUrl ? (
                        <a
                          href={student.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          LinkedIn Profile
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>

                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No students found matching your criteria
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
              {/* Show page numbers */}
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
  );
}