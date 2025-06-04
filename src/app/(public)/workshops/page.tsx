"use client";

import React from 'react';
import Link from 'next/link';
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CalendarDays, Users, Tag, BookOpen, Clock, ImageIcon } from "lucide-react";
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import WorkshopList from '@/app/(protected)/mentor-dashboard/workshops/_components/WorkshopList';
import PublicWorkshopList from './_components/PublicWorkshopList';


type ScheduleItem = {
  day: string;
  time: string;
  [key: string]: any; // Allow for other properties
};

type Workshop = {
  id: string;
  name: string;
  description: string;
  numberOfDays: number;
  schedule: ScheduleItem[];
  price: number;
  learningOutcomes: string[];
  courseDetails: Record<string, any>;
  otherDetails: string | null;
  introductoryVideoUrl: string | null; // Added for the workshop's intro video
  createdAt: Date;
  _count?: { enrollments: number };
  bannerImage: string | null;
  scheduleType: "recurring" | "custom";
  startDate: string | null;
  mentorGmailId: string;
};

const PublicWorkshopsPage = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = api.workshop.getPublicWorkshops.useInfiniteQuery(
    { limit: 9 }, 
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:max-w-[80%]">
        <h1 className="text-3xl font-bold mb-8 text-center">Discover Workshops</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </CardContent>
              <CardFooter>
                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Error Loading Workshops</h1>
        <p className="text-gray-700">{error?.message || "An unexpected error occurred."}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">Try Again</Button>
      </div>
    );
  }

  const workshops = data?.pages.flatMap(page => page.workshops) ?? [];

  const MAX_DESC_LENGTH = 120; 


    
  

  return (
    <div className=" min-h-[100dvh] md:pt-16 m-auto lg:max-w-[80%] ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Explore Our Workshops
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Unlock new skills and insights with expert-led workshops designed for growth and innovation.
          </p>
        </header>

        {workshops?.length === 0 && !isLoading && (
          <div className="text-center py-10">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Workshops Available</h3>
            <p className="mt-1 text-sm text-gray-500">Check back soon for new workshop announcements.</p>
          </div>
        )}

      <PublicWorkshopList
        workshops={workshops || []}
        isLoading={isLoading}
        onRefresh={() => void refetch()}
      />

        {hasNextPage && (
          <div className="text-center mt-12">
            <Button 
              onClick={() => fetchNextPage()} 
              disabled={isFetchingNextPage}
              variant="outline"
              size="lg"
            >
              {isFetchingNextPage ? 'Loading more...' : 'Load More Workshops'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicWorkshopsPage;
