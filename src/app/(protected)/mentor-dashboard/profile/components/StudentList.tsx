"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Search,
  Filter,
  X,
  UserCheck,
  MessageSquare,
  Calendar,
  Star,
  Clock,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    setStudents(studentsData);
  }, [studentsData]);

  console.log("studentsData", studentsData);
  console.log("students", students);

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

  // Toggle follow status for a student
  const toggleFollow = (studentId: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? { ...student, isFollowing: !student.isFollowing }
          : student,
      ),
    );
  };

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

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
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

        {/* Tabs for different views */}
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              All
            </TabsTrigger>
            <TabsTrigger value="following" className="text-xs sm:text-sm">
              Following
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="text-xs sm:text-sm">
              Scheduled
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
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
                          <AvatarImage
                            src={student.avatarUrl}
                            alt={student.name}
                          />
                          <AvatarFallback className="bg-blue-100 text-blue-800">
                            {student.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{student.name}</h3>
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm text-gray-500">
                              {student.role}
                            </p>
                            <div className="flex items-center text-sm text-gray-500">
                              <GraduationCap
                                size={14}
                                className="mr-1 text-gray-400"
                              />
                              {student.instituteName}
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {student.expertise.slice(0, 3).map((exp) => (
                              <Badge
                                key={exp}
                                variant="outline"
                                className="text-xs"
                              >
                                {exp}
                              </Badge>
                            ))}
                            {student.expertise.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{student.expertise.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={student.isFollowing ? "default" : "outline"}
                          size="sm"
                          className="flex h-8 items-center gap-1"
                          onClick={() => toggleFollow(student.id)}
                        >
                          {student.isFollowing ? (
                            <>
                              <UserCheck size={14} /> Following
                            </>
                          ) : (
                            <>
                              <UserPlus size={14} /> Follow
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t pt-3">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1 text-xs"
                          onClick={() =>
                            router.push(`/chat/${student.studentUserId}`)
                          }
                        >
                          <MessageSquare size={14} /> Message
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1 text-xs"
                          onClick={() =>
                            router.push("/mentor-dashboard/meetings")
                          }
                        >
                          <Calendar size={14} /> Schedule
                        </Button>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < student.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="following" className="mt-0">
            {filteredStudents?.filter((s) => s.isFollowing).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-center text-gray-500">
                  You are not following any students.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStudents
                  ?.filter((s) => s.isFollowing)
                  .map((student) => (
                    <div
                      key={student.id}
                      className="rounded-lg border p-4 transition-all hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={student.avatarUrl}
                              alt={student.name}
                            />
                            <AvatarFallback className="bg-blue-100 text-blue-800">
                              {student.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{student.name}</h3>
                            <div className="flex flex-col space-y-1">
                              <p className="text-sm text-gray-500">
                                {student.role}
                              </p>
                              <div className="flex items-center text-sm text-gray-500">
                                <GraduationCap
                                  size={14}
                                  className="mr-1 text-gray-400"
                                />
                                {student.instituteName}
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {student.expertise.slice(0, 3).map((exp) => (
                                <Badge
                                  key={exp}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {exp}
                                </Badge>
                              ))}
                              {student.expertise.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{student.expertise.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant={
                              student.isFollowing ? "default" : "outline"
                            }
                            size="sm"
                            className="flex h-8 items-center gap-1"
                            onClick={() => toggleFollow(student.id)}
                          >
                            {student.isFollowing ? (
                              <>
                                <UserCheck size={14} /> Following
                              </>
                            ) : (
                              <>
                                <UserPlus size={14} /> Follow
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t pt-3">
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1 text-xs"
                            onClick={() =>
                              router.push(`/chat/${student.studentUserId}`)
                            }
                          >
                            <MessageSquare size={14} /> Message
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1 text-xs"
                            onClick={() =>
                              router.push("/mentor-dashboard/meetings")
                            }
                          >
                            <Calendar size={14} /> Schedule
                          </Button>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < student.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="scheduled" className="mt-0">
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-center text-gray-500">
                Coming soon: View students with scheduled meetings
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StudentList;
