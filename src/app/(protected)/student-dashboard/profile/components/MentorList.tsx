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

// Mock data for mentors - in a real app, this would come from an API
// const mentorsData = [
//   {
//     id: "1",
//     name: "Prashant Kumar Singh",
//     role: "Software Developer",
//     company: "Google",
//     expertise: ["Web Development", "React", "Node.js"],
//     avatarUrl: "",
//     isFollowing: true,
//     lastInteraction: "2023-11-15T14:30:00",
//     rating: 5,
//     upcomingMeeting: {
//       date: "2023-12-05T10:00:00",
//       topic: "Career Guidance",
//     },
//   },
//   {
//     id: "2",
//     name: "Ananya Sharma",
//     role: "UX Designer",
//     company: "Microsoft",
//     expertise: ["UI/UX Design", "Figma", "User Research"],
//     avatarUrl: "",
//     isFollowing: true,
//     lastInteraction: "2023-11-10T11:15:00",
//     rating: 4,
//     upcomingMeeting: null,
//   },
//   {
//     id: "3",
//     name: "Rahul Verma",
//     role: "Data Scientist",
//     company: "Amazon",
//     expertise: ["Machine Learning", "Python", "Data Analysis"],
//     avatarUrl: "",
//     isFollowing: true,
//     lastInteraction: "2023-10-28T15:45:00",
//     rating: 5,
//     upcomingMeeting: {
//       date: "2023-12-10T14:30:00",
//       topic: "ML Project Review",
//     },
//   },
//   {
//     id: "4",
//     name: "Neha Patel",
//     role: "Product Manager",
//     company: "Facebook",
//     expertise: ["Product Strategy", "Agile", "Market Research"],
//     avatarUrl: "",
//     isFollowing: false,
//     lastInteraction: "2023-11-05T12:00:00",
//     rating: 4,
//     upcomingMeeting: {
//       date: "2023-12-15T16:00:00",
//       topic: "Product Launch Strategy",
//     },
//   },
//   {
//     id: "5",
//     name: "Vikram Malhotra",
//     role: "Mobile Developer",
//     company: "Apple",
//     expertise: ["iOS", "Swift", "React Native"],
//     avatarUrl: "",
//     isFollowing: false,
//     lastInteraction: "2023-11-20T10:30:00",
//     rating: 3,
//     upcomingMeeting: null,
//   },
// ];

// All expertise areas from mentors

interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  expertise: string[];
  avatarUrl: string;
  isFollowing: boolean;
  rating: number;
  mentorUserId: string;
}

const MentorList = ({ mentorsData }: { mentorsData: Mentor[] }) => {
  const [mentors, setMentors] = useState<Mentor[]>(mentorsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const router = useRouter();
  useEffect(() => {
    setMentors(mentorsData);
  }, [mentorsData]);

  console.log("mentorsData", mentorsData);
  console.log("mentors", mentors);

  const allExpertiseAreas = Array.from(
    new Set(mentorsData?.flatMap((mentor) => mentor.expertise) || []),
  );

  // Filter mentors based on search query and selected expertise
  const filteredMentors = mentors?.filter((mentor) => {
    const matchesSearch =
      searchQuery === "" ||
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some((exp: string) =>
        exp.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesExpertise =
      selectedExpertise.length === 0 ||
      mentor.expertise.some((exp: string) => selectedExpertise.includes(exp));

    return matchesSearch && matchesExpertise;
  });

  // Toggle follow status for a mentor
  const toggleFollow = (mentorId: string) => {
    setMentors((prev) =>
      prev.map((mentor) =>
        mentor.id === mentorId
          ? { ...mentor, isFollowing: !mentor.isFollowing }
          : mentor,
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
          <CardTitle>My Mentors</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and filter */}
        <div className="mb-4 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search your mentors..."
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
                    Filter by expertise
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

          {/* Active filters */}
          {selectedExpertise.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedExpertise.map((expertise) => (
                <Badge
                  key={expertise}
                  variant="secondary"
                  className="gap-1 pr-1"
                >
                  {expertise}
                  <button
                    className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
                    onClick={() => toggleExpertiseFilter(expertise)}
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

        {/* Mentor list */}
        {filteredMentors?.length > 0 ? (
          <div className="space-y-4">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="flex flex-col rounded-lg border p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={mentor.avatarUrl} alt={mentor.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-800">
                        {mentor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-800">{mentor.name}</p>
                      <p className="text-sm text-gray-500">
                        {mentor.role} at {mentor.company}
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < mentor.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                   
                    <Button 
                    onClick={() => {
                      router.push(`/mentors/${mentor.mentorUserId}`);
                    }}
                    variant="outline" size="sm" className="h-8 gap-1">
                      <Calendar size={14} />
                      <span className="hidden sm:inline">Schedule</span>
                    </Button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {mentor.expertise.map((exp: string) => (
                    <Badge key={exp} variant="outline" className="text-xs">
                      {exp}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed">
            <p className="text-gray-500">No mentors found</p>
            {searchQuery && (
              <Button
                variant="link"
                className="mt-2"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MentorList;
