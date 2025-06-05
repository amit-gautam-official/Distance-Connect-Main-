"use client";
import { api } from "@/trpc/react";
import React, { useState, useEffect, useMemo } from "react";
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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
import { useDebounce } from "@/hooks/use-debounce"; // You'll need to create this hook

interface FilterState {
  companies: string[];
  jobTitles: string[];
  industries: string[];
  experienceRange: string;
  hiringFields: string[];
}


const MentorsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
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

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const itemsPerPage = 12;

  // Memoize query parameters to prevent unnecessary refetches
  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearchQuery || undefined,
    sortBy: sortBy as "recommended" | "pricing" | "availability",
    filters: filters,
  }), [currentPage, debouncedSearchQuery, sortBy, filters]);

  const {
    data: mentorsData,
    isError,
    isLoading,
    isFetching,
  } = api.mentor.getAllMentors.useQuery(queryParams, {
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Separate query for filter options
  const { data: filterOptions } = api.mentor.getMentorFilterOptions.useQuery(undefined, {
    staleTime: 10 * 60 * 1000, // 10 minutes - filter options don't change often
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, sortBy, filters]);

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

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(mentorsData?.pagination.totalPages || 1);
  const goToPreviousPage = () => goToPage(Math.max(1, currentPage - 1));
  const goToNextPage = () => goToPage(Math.min(mentorsData?.pagination.totalPages || 1, currentPage + 1));

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const totalPages = mentorsData?.pagination.totalPages || 1;
    const current = currentPage;
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, current - 1);
      const end = Math.min(totalPages - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (isError) {
    return (
      <div className="text-center text-red-500">Error loading mentors</div>
    );
  }

  return (
    <div className="container mx-auto w-[80%] pb-[100px] md:pt-[40px]">
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
                    {filterOptions?.companies.map((company) => (
                      <div key={company} className="flex items-center space-x-2">
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
                    ))}
                  </div>
                </div>

                {/* Job Titles */}
                <div className="space-y-4">
                  <Label>Job Titles</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {filterOptions?.jobTitles.map((title) => (
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
                    {filterOptions?.industries.map((industry) => (
                      <div key={industry} className="flex items-center space-x-2">
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
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div className="space-y-4">
                  <Label>Skills</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {filterOptions?.hiringFields.map((field) => (
                      <div key={field} className="flex items-center space-x-2">
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
                    ))}
                  </div>
                </div>
              </div>

              <SheetFooter className="flex-row justify-between">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <Button onClick={() => document.querySelector("[data-dismiss]")}>
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

      {/* Results count and loading indicator */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {mentorsData ? (
            <>
              Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, mentorsData.pagination.totalCount)} of {mentorsData.pagination.totalCount} mentors
            </>
          ) : (
            'Loading mentors...'
          )}
        </div>
        {isFetching && (
          <div className="text-sm text-muted-foreground">
            Loading...
          </div>
        )}
      </div>

      {/* Mentors Grid */}
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {isLoading
          ? Array(itemsPerPage).fill(0).map((_, i) => (
              <Card key={i} className="group flex h-full flex-col overflow-hidden bg-white transition-all">
                {/* Skeleton content */}

                <div className="relative flex flex-col items-center p-6 pb-4">
                  <Skeleton className="h-20 w-20 mb-4 rounded-full border-2 border-white shadow" />
                  <Skeleton className="mb-1 h-6 w-32 rounded" />
                  <div className="mb-2 flex flex-col items-center gap-1 w-full">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground w-full justify-center">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-24 rounded" />
                    <Skeleton className="h-4 w-12 rounded" />
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground w-full justify-center">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-16 rounded" />
                  </div>
                </div>
                <div className="px-6 pb-4">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="flex-1 px-6 pb-4">
                  <Skeleton className="mb-2 h-4 w-16" />
                  <div className="flex flex-wrap gap-1.5">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                    <Skeleton className="h-6 w-12 rounded-full" />
                    <Skeleton className="h-6 w-10 rounded-full" />
                  </div>
                </div>
                <div className="border-t border-border bg-muted/10 p-4 mt-auto">
                  <div className="flex items-center justify-between gap-2">
                    <Skeleton className="h-9 w-24 rounded" />
                    <Skeleton className="h-9 w-24 rounded" />
                  </div>
                </div>
              </Card>
            ))
          : mentorsData?.mentors?.map((mentor) => (
              <MentorCard key={mentor.userId} mentor={mentor!} />
            ))}
      </div>

      {/* Pagination */}
      {mentorsData && mentorsData.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {/* First page button */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToFirstPage}
            disabled={!mentorsData.pagination.hasPreviousPage}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* Previous page button */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={!mentorsData.pagination.hasPreviousPage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page numbers */}
          {getPageNumbers().map((page, index) => (
            <Button
              key={index}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => typeof page === 'number' && goToPage(page)}
              disabled={typeof page === 'string'}
              className={`min-w-[40px] ${typeof page === 'string' ? 'cursor-default' : ''}`}
            >
              {page}
            </Button>
          ))}

          {/* Next page button */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={!mentorsData.pagination.hasNextPage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last page button */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToLastPage}
            disabled={!mentorsData.pagination.hasNextPage}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Page info */}
      {mentorsData && mentorsData.pagination.totalPages > 1 && (
        <div className="text-center text-sm text-muted-foreground mt-4">
          Page {currentPage} of {mentorsData.pagination.totalPages}
        </div>
      )}
    </div>
  );
};

export default MentorsPage;