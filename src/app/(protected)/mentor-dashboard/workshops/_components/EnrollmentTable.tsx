'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Enrollment = {
  id: string;
  createdAt: string;
  paymentStatus: boolean;
  student: {
    user: {
      name?: string;
      image?: string;
    };
    studentName?: string;
  };
};

type EnrollmentTableProps = {
  enrollments: Enrollment[];
};

export default function EnrollmentTable({ enrollments }: any) {
  const [filter, setFilter] = useState<'all' | 'paid' | 'not_paid'>('all');

  const filteredEnrollments = enrollments.filter((enrollment : any) => {
    if (filter === 'paid') return enrollment.paymentStatus === true;
    if (filter === 'not_paid') return enrollment.paymentStatus === false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filter Dropdown */}
      <div className="flex justify-end">
        <Select onValueChange={(value) => setFilter(value as any)} defaultValue="all">
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="not_paid">Not Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Enrolled On</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEnrollments.map((enrollment : any) => (
            <TableRow key={enrollment.id}>
              <TableCell className="flex items-center gap-2">
                <Avatar className="h-6 w-6 md:h-8 md:w-8">
                  <AvatarImage
                    src={enrollment.student.user.image || ''}
                    alt={enrollment.student.user.name || ''}
                  />
                  <AvatarFallback>
                    {enrollment.student.user.name?.charAt(0).toUpperCase() || 'S'}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-xs md:text-base">
                  {enrollment.student.user.name ||
                    enrollment.student.studentName ||
                    'Student'}
                </span>
              </TableCell>
              <TableCell className="text-xs md:text-base">
                {new Date(enrollment.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-xs md:text-base">
                {enrollment.paymentStatus ? (
                  <Badge variant="outline">Paid</Badge>
                ) : (
                  <Badge variant="destructive">Not Paid</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
