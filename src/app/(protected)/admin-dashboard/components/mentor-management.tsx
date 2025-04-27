"use client";

import { useState } from "react";
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
import { Search } from "lucide-react";
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
}

interface MentorManagementProps {
  mentors: Mentor[];
  handleVerify: (mentor: Mentor) => void;
}

export default function MentorManagement({
  mentors,
  handleVerify,
}: MentorManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("all");

  const filteredMentors = mentors.filter((mentor) => {
    // Apply search filter
    const mentorName = mentor.mentorName || "";
    const userEmail = mentor.user?.email || "";
    const username = mentor.user?.username || "";
    
    const matchesSearch =
      mentorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (username && username.toLowerCase().includes(searchQuery.toLowerCase()));

    // Apply verification filter
    const matchesVerification =
      verificationFilter === "all"
        ? true
        : verificationFilter === "verified"
          ? mentor.verified
          : !mentor.verified;

    return matchesSearch && matchesVerification;
  });

  return (
    <>
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center md:mb-6">
        <h2 className="text-xl font-semibold md:text-2xl">Mentor Management</h2>
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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full">
          <Select
            value={verificationFilter}
            onValueChange={setVerificationFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Mentors</SelectItem>
              <SelectItem value="verified">Verified Only</SelectItem>
              <SelectItem value="unverified">Unverified Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">
                  Profile
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMentors.length > 0 ? (
                filteredMentors.map((mentor) => (
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
                    <TableCell>
                      {mentor.verified ? (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-orange-500 text-orange-500"
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
                  <TableCell colSpan={5} className="text-center">
                    No mentors found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}