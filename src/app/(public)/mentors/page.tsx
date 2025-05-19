"use client";
import { api } from "@/trpc/react";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Building2,
  Briefcase,
  MapPin,
  SlidersHorizontal,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MentorCard } from "@/components/mentor/MentorCard";

interface FilterState {
  companies: string[];
  jobTitles: string[];
  industries: string[];
  experienceRange: string;
  hiringFields: string[];
}




const MentorsPagePublic = () => {
  const {
    data: mentors,
    isError,
    isLoading,
  } = api.mentor.getAllMentors.useQuery(undefined, {
    // Reduce retries to avoid rate limit issues
    retry: 1,
    // Increase staleTime to reduce refetches
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [filters, setFilters] = useState<FilterState>({
    companies: [],
    jobTitles: [],
    industries: [],
    experienceRange: "all",
    hiringFields: [],
  });
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(
    new Set(),
  );

  // Extract unique values for filters
  const uniqueValues = mentors?.reduce(
    (acc, mentor) => {
      if (mentor.currentCompany) acc.companies.add(mentor.currentCompany);
      if (mentor.jobTitle) acc.jobTitles.add(mentor.jobTitle);
      if (mentor.industry) acc.industries.add(mentor.industry);
      mentor.hiringFields?.forEach((field) => acc.hiringFields.add(field));
      return acc;
    },
    {
      companies: new Set<string>(),
      jobTitles: new Set<string>(),
      industries: new Set<string>(),
      hiringFields: new Set<string>(),
    },
  );

  // Filter mentors based on all criteria
  const filteredMentors = mentors
    ?.filter((mentor) => {
      const matchesSearch =
        mentor.mentorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.currentCompany
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        mentor.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCompany =
        filters.companies.length === 0 ||
        (mentor.currentCompany &&
          filters.companies.includes(mentor.currentCompany));

      const matchesJobTitle =
        filters.jobTitles.length === 0 ||
        (mentor.jobTitle && filters.jobTitles.includes(mentor.jobTitle));

      const matchesIndustry =
        filters.industries.length === 0 ||
        (mentor.industry && filters.industries.includes(mentor.industry));

      const matchesExperience = () => {
        if (filters.experienceRange === "all") return true;
        const exp = parseInt(mentor.experience || "0");
        switch (filters.experienceRange) {
          case "0-2":
            return exp >= 0 && exp <= 2;
          case "3-5":
            return exp >= 3 && exp <= 5;
          case "6-10":
            return exp >= 6 && exp <= 10;
          case "10+":
            return exp > 10;
          default:
            return true;
        }
      };

      const matchesHiringFields =
        filters.hiringFields.length === 0 ||
        mentor.hiringFields?.some((field) =>
          filters.hiringFields.includes(field),
        );

      return (
        matchesSearch &&
        matchesCompany &&
        matchesJobTitle &&
        matchesIndustry &&
        matchesExperience() &&
        matchesHiringFields
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recommended":
          // Sort by a combination of experience and rating
          const aScore = parseInt(a.experience || "0") * 5;
          const bScore = parseInt(b.experience || "0") * 5;
          return bScore - aScore;
        case "pricing":
          // Sort by pricing (assuming lower price is better)
          return 2000 - 2000; // Replace with actual pricing when available
        case "availability":
          // Sort by number of available slots (when implemented)
          const aSlots = a.meetingEvents?.length || 0;
          const bSlots = b.meetingEvents?.length || 0;
          return bSlots - aSlots;
        default:
          return 0;
      }
    });

  const handleFilterChange = (category: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const currentValues = prev[category] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [category]: newValues };
    });
  };

  const clearFilters = () => {
    setFilters({
      companies: [],
      jobTitles: [],
      industries: [],
      experienceRange: "all",
      hiringFields: [],
    });
  };

  const toggleDescription = (mentorId: string) => {
    setExpandedDescriptions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(mentorId)) {
        newSet.delete(mentorId);
      } else {
        newSet.add(mentorId);
      }
      return newSet;
    });
  };

  if (isError) {
    return (
      <div className="text-center text-red-500">Error loading mentors</div>
    );
  }

  return (
    <div className="container mx-auto w-[80%] pb-[100px] md:pt-[150px]">
      <div className="mb-8">
        <h1 className="mb-4 text-3xl font-bold">Find Your Mentor</h1>
        <div className="flex flex-col gap-4 md:flex-row">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, company, or job title..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-[150px]">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
                {Object.values(filters).flat().length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {Object.values(filters).flat().length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] overflow-y-auto sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Filter Mentors</SheetTitle>
                <SheetDescription>
                  Apply filters to find the perfect mentor for you
                </SheetDescription>
              </SheetHeader>

              <div className="grid gap-6 py-4">
                {/* Experience Range */}
                <div className="space-y-4">
                  <Label>Experience Range</Label>
                  <Select
                    value={filters.experienceRange}
                    onValueChange={(value) =>
                      setFilters((prev) => ({
                        ...prev,
                        experienceRange: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Experience Levels</SelectItem>
                      <SelectItem value="0-2">0-2 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="6-10">6-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Companies */}
                <div className="space-y-4">
                  <Label>Companies</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from(uniqueValues?.companies || []).map(
                      (company, index) => (
                        <div
                          key={`${company}-${index}`}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`company-${company}`}
                            checked={filters.companies.includes(company)}
                            onCheckedChange={() =>
                              handleFilterChange("companies", company)
                            }
                          />
                          <label
                            htmlFor={`company-${company}`}
                            className="text-sm"
                          >
                            {company}
                          </label>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Job Titles */}
                <div className="space-y-4">
                  <Label>Job Titles</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from(uniqueValues?.jobTitles || []).map((title) => (
                      <div key={title} className="flex items-center space-x-2">
                        <Checkbox
                          id={`title-${title}`}
                          checked={filters.jobTitles.includes(title)}
                          onCheckedChange={() =>
                            handleFilterChange("jobTitles", title)
                          }
                        />
                        <label htmlFor={`title-${title}`} className="text-sm">
                          {title}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Industries */}
                <div className="space-y-4">
                  <Label>Industries</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from(uniqueValues?.industries || []).map(
                      (industry) => (
                        <div
                          key={industry}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`industry-${industry}`}
                            checked={filters.industries.includes(industry)}
                            onCheckedChange={() =>
                              handleFilterChange("industries", industry)
                            }
                          />
                          <label
                            htmlFor={`industry-${industry}`}
                            className="text-sm"
                          >
                            {industry}
                          </label>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Hiring Fields */}
                <div className="space-y-4">
                  <Label>Hiring Fields</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from(uniqueValues?.hiringFields || []).map(
                      (field) => (
                        <div
                          key={field}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`field-${field}`}
                            checked={filters.hiringFields.includes(field)}
                            onCheckedChange={() =>
                              handleFilterChange("hiringFields", field)
                            }
                          />
                          <label htmlFor={`field-${field}`} className="text-sm">
                            {field}
                          </label>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>

              <SheetFooter className="flex-row justify-between">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <Button
                  onClick={() => document.querySelector("[data-dismiss]")}
                >
                  Apply Filters
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* Sort Options */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="pricing">Price: Low to High</SelectItem>
              <SelectItem value="availability">Most Available</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredMentors?.length || 0} mentors
      </div>

      {/* Mentors Grid */}
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array(8).fill(0).map((_, i) => (
            <Card key={i} className="group flex h-full flex-col overflow-hidden bg-white transition-all">
              {/* Badge */}
              <div className="absolute right-0 top-0">
                <Skeleton className="m-2 h-6 w-24 rounded-full" />
              </div>
              {/* Avatar and Basic Info */}
              <div className="relative flex flex-col items-center p-6 pb-4">
                <Skeleton className="h-20 w-20 mb-4 rounded-full border-2 border-white shadow" />
                <Skeleton className="mb-1 h-6 w-32 rounded" /> {/* Name */}
                <div className="mb-2 flex flex-col items-center gap-1 w-full">
                  <Skeleton className="h-4 w-24 mb-1" /> {/* Job title */}
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-20" /> {/* Company */}
                    <Skeleton className="h-4 w-10" /> {/* YOE */}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground w-full justify-center">
                  <Skeleton className="h-4 w-4 rounded" /> {/* Building Icon */}
                  <Skeleton className="h-4 w-24 rounded" /> {/* Company Name */}
                  <Skeleton className="h-4 w-12 rounded" /> {/* Verified badge */}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground w-full justify-center">
                  <Skeleton className="h-4 w-4 rounded" /> {/* MapPin Icon */}
                  <Skeleton className="h-4 w-16 rounded" /> {/* Location */}
                </div>
              </div>
              {/* Bio Section */}
              <div className="px-6 pb-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              {/* Skills */}
              <div className="flex-1 px-6 pb-4">
                <Skeleton className="mb-2 h-4 w-16" /> {/* Skills label */}
                <div className="flex flex-wrap gap-1.5">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-14 rounded-full" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                  <Skeleton className="h-6 w-10 rounded-full" />
                </div>
              </div>
              {/* Footer */}
              <div className="border-t border-border bg-muted/10 p-4 mt-auto">
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="h-9 w-24 rounded" />
                  <Skeleton className="h-9 w-24 rounded" />
                </div>
              </div>
            </Card>
          ))
          : filteredMentors?.map((mentor) => (
            <>
              <MentorCard key={mentor.userId} mentor={mentor!} />

            </>
            ))}
      </div>
    </div>
  );
};

export default MentorsPagePublic;
