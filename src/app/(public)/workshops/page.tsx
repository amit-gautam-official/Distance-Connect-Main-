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

const formatPrice = (price: number) => {
  if (price === 0) return "Free";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0, 
    maximumFractionDigits: 2,
  }).format(price / 100); 
};

const PublicWorkshopsPage = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = api.workshop.getPublicWorkshops.useInfiniteQuery(
    { limit: 9 }, 
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
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
    <div className="bg-gradient-to-br from-slate-50 to-sky-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Explore Our Workshops
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Unlock new skills and insights with expert-led workshops designed for growth and innovation.
          </p>
        </header>

        {workshops.length === 0 && !isLoading && (
          <div className="text-center py-10">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Workshops Available</h3>
            <p className="mt-1 text-sm text-gray-500">Check back soon for new workshop announcements.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.map((workshop) => {
            const truncatedDescription = workshop.description.length > MAX_DESC_LENGTH
              ? workshop.description.substring(0, MAX_DESC_LENGTH) + "..."
              : workshop.description;
            const showViewDetailsLink = workshop.description.length > MAX_DESC_LENGTH;

            let scheduleTimeDisplay = 'N/A';
            if (workshop.schedule && Array.isArray(workshop.schedule) && workshop.schedule.length > 0) {
                const firstScheduleItem = workshop.schedule[0] as any;
                if (workshop.scheduleType === "recurring" && firstScheduleItem.time) {
                    scheduleTimeDisplay = firstScheduleItem.time;
                } else if (workshop.scheduleType === "custom" && firstScheduleItem.startTime && firstScheduleItem.endTime) {
                    scheduleTimeDisplay = `${firstScheduleItem.startTime} - ${firstScheduleItem.endTime}`;
                } else if (firstScheduleItem.time) { 
                    scheduleTimeDisplay = firstScheduleItem.time;
                }
            }

            return (
            <Card key={workshop.id} className="flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white group">
              {workshop.bannerImage ? (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image 
                    src={workshop.bannerImage}
                    alt={workshop.name} 
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="relative h-48 w-full overflow-hidden flex items-center justify-center bg-slate-200 group-hover:bg-slate-300 transition-colors">
                  <ImageIcon className="h-16 w-16 text-slate-400 group-hover:text-slate-500 transition-colors" />
                </div>
              )}
              <CardHeader className="p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={workshop.mentor.user.image ?? undefined} alt={workshop.mentor.user.name ?? 'Mentor'} />
                    <AvatarFallback>{workshop.mentor.user.name?.charAt(0).toUpperCase() ?? 'M'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-800 hover:text-sky-600 transition-colors">
                      <Link href={`/workshops/${workshop.id}`}>{workshop.name}</Link>
                    </CardTitle>
                    {workshop.mentor.user.name && (
                      <p className="text-xs text-gray-500">By {workshop.mentor.user.name}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-grow space-y-3">
                {workshop.introductoryVideoUrl && (
                  <div className="mb-3 rounded-md overflow-hidden">
                    <video controls width="100%" className="aspect-video">
                      <source src={workshop.introductoryVideoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                <p className="text-sm text-gray-600">
                  {truncatedDescription}
                  {showViewDetailsLink && (
                    <Link href={`/workshops/${workshop.id}`} className="text-sky-600 hover:text-sky-700 font-medium ml-1">
                      View Details
                    </Link>
                  )}
                </p>
                
                <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex items-center">
                        <CalendarDays className="h-3.5 w-3.5 mr-2 text-sky-500 flex-shrink-0" />
                        <span>{workshop.numberOfDays} Day{workshop.numberOfDays !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-2 text-sky-500 flex-shrink-0" />
                        <span>{scheduleTimeDisplay}</span>
                    </div>
                    <div className="flex items-center">
                        <Users className="h-3.5 w-3.5 mr-2 text-sky-500 flex-shrink-0" />
                        <span>{workshop._count.enrollments} Enrolled</span>
                    </div>
                </div>

                <div className="pt-2">
                    <div className="text-lg font-bold text-sky-600 bg-sky-50 inline-block px-3 py-1 rounded-full">
                        {formatPrice(workshop.price)}
                    </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 border-t bg-gray-50 flex justify-end">
                <Link href={`/workshops/${workshop.id}`} passHref>
                  <Button variant="outline" size="sm" className="hover:bg-sky-50 transition-colors">
                    View Details <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )})
        }
        </div>

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
