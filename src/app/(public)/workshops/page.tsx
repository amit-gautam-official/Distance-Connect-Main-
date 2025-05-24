"use client";

import React from 'react';
import Link from 'next/link';
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CalendarDays, Users, Tag, BookOpen } from "lucide-react";
import Image from 'next/image';

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
    { limit: 9 }, // Fetch 9 workshops per page
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workshops.map((workshop) => (
            <Card key={workshop.id} className="flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white">
              <div className="relative h-56 w-full">
                <Image 
                  src={workshop.bannerImage || '/placeholder-workshop.jpg'} 
                  alt={workshop.name} 
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold text-gray-900 hover:text-sky-600 transition-colors">
                  <Link href={`/workshops/${workshop.id}`}>{workshop.name}</Link>
                </CardTitle>
                {workshop.mentor.user.name && (
                  <p className="text-sm text-gray-500">With {workshop.mentor.user.name}</p>
                )}
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                  {workshop.description}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <CalendarDays className="h-4 w-4 mr-2 text-sky-500" />
                  <span>{workshop.numberOfDays} Days</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2 text-sky-500" />
                  <span>{workshop._count.enrollments} Enrolled</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center bg-gray-50 p-4">
                <Badge variant={workshop.price === 0 ? "default" : "secondary"} className={`${workshop.price === 0 ? 'bg-green-100 text-green-700' : 'bg-sky-100 text-sky-700'}`}>
                  <Tag className="h-3 w-3 mr-1.5" />
                  {workshop.price === 0 ? 'Free' : `₹${(workshop.price / 100).toFixed(2)}`}
                </Badge>
                <Link href={`/workshops/${workshop.id}`} passHref>
                  <Button size="sm" className="bg-sky-600 hover:bg-sky-700 text-white">
                    View Details <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
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
