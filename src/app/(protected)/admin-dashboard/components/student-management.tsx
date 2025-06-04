"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from "lucide-react";

interface Student  {
    user: {
        id: string;
        username: string | null;
        email: string;
        image: string | null;
    };
    userId: string;
    studentRole: "WORKING" | "HIGHSCHOOL" | "COLLEGE" | null;
    studentName: string | null;
    linkedInUrl?: string | null;
}

interface StudentManagementProps {
  students: Student[];
}

export default function StudentManagement({
  students,
}: StudentManagementProps) {
  
  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Student Type', 'LinkedIn URL'];
    
    const csvContent = [
      headers.join(','),
      ...students.map(student => [
        `"${student.studentName || ''}"`,
        `"${student.user.email}"`,
        `"${student.studentRole || ''}"`,
        `"${student.linkedInUrl || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `students_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center md:mb-6">
        <h2 className="text-xl font-semibold md:text-2xl">
          Student Management
        </h2>
        <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      <div className="rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden sm:table-cell">Student Type</TableHead>
                <TableHead className="hidden md:table-cell">LinkedIn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.userId}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {student.user.image && (
                        <img
                          src={student?.user?.image.trim()}
                          alt={student.studentName || "Student"}
                          className="h-8 w-8 rounded-full"
                        />
                      )}
                      <div>{student.studentName}</div>
                    </div>
                  </TableCell>
                  <TableCell>{student.user.email}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {student.studentRole}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {student.linkedInUrl ? (
                      <a
                        href={student.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Profile
                      </a>
                    ) : (
                      "Not Available"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}