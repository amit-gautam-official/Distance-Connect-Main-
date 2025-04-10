"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  X,
  MessageSquare,
  Star,
  GraduationCap,
  Building,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

interface Student {
  id: string;
  name: string;
  role: string;
  instituteName: string;
  expertise: string[];
  avatarUrl: string;
  isFollowing: boolean;
  rating: number;
  studentUserId: string;
}

const StudentList = ({ studentsData }: { studentsData: Student[] }) => {
  const [students, setStudents] = useState<Student[]>(studentsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    setStudents(studentsData);
  }, [studentsData]);

  const allExpertiseAreas = Array.from(
    new Set(studentsData?.flatMap((student) => student.expertise) || []),
  );

  // Filter students based on search query and selected expertise
  const filteredStudents = students?.filter((student) => {
    const matchesSearch =
      searchQuery === "" ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.instituteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.expertise.some((exp: string) =>
        exp.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesExpertise =
      selectedExpertise.length === 0 ||
      student.expertise.some((exp: string) => selectedExpertise.includes(exp));

    return matchesSearch && matchesExpertise;
  });

  // Toggle expertise filter
  const toggleExpertiseFilter = (expertise: string) => {
    setSelectedExpertise((prev) =>
      prev.includes(expertise)
        ? prev.filter((exp) => exp !== expertise)
        : [...prev, expertise],
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedExpertise([]);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>My Students</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and filter */}
        <div className="mb-4 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search your students..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Filter size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <div className="mb-2 text-sm font-medium">
                    Filter by interests
                  </div>
                  {allExpertiseAreas.map((expertise) => (
                    <DropdownMenuCheckboxItem
                      key={expertise}
                      checked={selectedExpertise.includes(expertise)}
                      onCheckedChange={() => toggleExpertiseFilter(expertise)}
                    >
                      {expertise}
                    </DropdownMenuCheckboxItem>
                  ))}
                  {selectedExpertise.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 w-full text-xs"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Applied filters */}
          {selectedExpertise.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedExpertise.map((expertise) => (
                <Badge
                  key={expertise}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {expertise}
                  <button
                    onClick={() => toggleExpertiseFilter(expertise)}
                    className="ml-1 rounded-full hover:bg-gray-200"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={clearFilters}
              >
                Clear All
              </Button>
            </div>
          )}
        </div>

        {/* Student list */}
        {filteredStudents?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-center text-gray-500">
              No students found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStudents?.map((student) => (
              <div
                key={student.id}
                className="rounded-lg border p-4 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={student.avatarUrl} alt={student.name} />
                      <AvatarFallback>
                        {student.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{student.name}</h3>
                      <p className="text-sm text-gray-500">{student.role}</p>
                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                        <GraduationCap className="h-4 w-4" />
                        <span>{student.instituteName}</span>
                      </div>
                    </div>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        router.push(`/chat?studentId=${student.studentUserId}`)
                      }
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div> */}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {student.expertise.map((exp) => (
                    <Badge key={exp} variant="secondary">
                      {exp}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentList;
