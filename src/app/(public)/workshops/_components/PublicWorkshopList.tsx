"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Users, Eye, PlayCircle, ExternalLink, BookOpen } from "lucide-react"; 
import { Badge } from '@/components/ui/badge';

// Define the structure of a schedule item
interface ScheduleItem {
  day: string;
  time: string;
  [key: string]: any; // Allow for other properties if they exist
}

// Define the Workshop type based on data from getPublicWorkshops
export type Workshop = {
  id: string;
  name: string;
  description: string;
  price: number;
  numberOfDays: number;
  bannerImage: string | null;
  introductoryVideoUrl: string | null;
  schedule: any; // Prisma JsonValue can be complex, be flexible
  learningOutcomes: any;
  courseDetails: any;
  otherDetails: string | null;
  createdAt: Date;
  mentor: {
    user: {
      name: string | null;
      image: string | null;
    };
  };
  _count: {
    enrollments: number;
  };
};

interface PublicWorkshopListProps {
  workshops: Workshop[];
  isLoading: boolean;
}

const MAX_DESC_LENGTH = 120; // Maximum characters for description

// Format price to INR
const formatPrice = (price: number) => {
  if (price === 0) return "Free";
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0, 
    maximumFractionDigits: 2,
  }).format(price / 100); // Assuming price is in paise
};

export default function PublicWorkshopList({ workshops, isLoading }: PublicWorkshopListProps) {
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const handlePlayVideo = (workshopId: string) => {
    const videoElement = videoRefs.current[workshopId];
    if (videoElement) {
      if (videoElement.paused) {
        videoElement.play();
      } else {
        videoElement.pause();
      }
    }
  };

  if (isLoading && workshops.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="flex flex-col overflow-hidden rounded-xl shadow-lg animate-pulse">
            <div className="h-56 w-full bg-gray-300"></div>
            <CardHeader className="pb-3 pt-4">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </CardHeader>
            <CardContent className="flex-grow space-y-2 py-2">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </CardContent>
            <CardFooter className="bg-gray-100 p-3 sm:p-4 flex justify-between items-center">
              <div className="h-8 bg-gray-300 rounded w-1/4"></div>
              <div className="h-10 bg-gray-300 rounded w-1/3"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {workshops.map((workshop) => {
        const truncatedDesc = workshop.description.length > MAX_DESC_LENGTH
          ? workshop.description.substring(0, MAX_DESC_LENGTH) + "..."
          : workshop.description;

        return (
          <Card key={workshop.id} className="flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white group">
            <div className="relative h-56 w-full">
              {workshop.introductoryVideoUrl ? (
                <div className="relative h-full w-full group/video">
                  <video
                    ref={(el) => { videoRefs.current[workshop.id] = el; }}
                    src={workshop.introductoryVideoUrl}
                    poster={workshop.bannerImage || '/placeholder-workshop.jpg'}
                    className="w-full h-full object-cover"
                    controls={false} 
                    loop
                    muted
                    playsInline
                    onClick={() => handlePlayVideo(workshop.id)} // Allow clicking video to play/pause
                  />
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover/video:opacity-100 transition-opacity duration-300 cursor-pointer"
                    onClick={() => handlePlayVideo(workshop.id)}
                  >
                    <PlayCircle className="h-16 w-16 text-white opacity-80 group-hover/video:opacity-100" />
                  </div>
                   <div className="absolute top-2 right-2">
                     <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm pointer-events-none">
                       Intro Video
                     </Badge>
                   </div>
                </div>
              ) : workshop.bannerImage ? (
                <Image 
                  src={workshop.bannerImage}
                  alt={workshop.name} 
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
            
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-xl font-semibold text-[#3D568F] hover:text-[#2c3e6a] transition-colors">
                <Link href={`/workshops/${workshop.id}`}>{workshop.name}</Link>
              </CardTitle>
              {workshop.mentor.user.name && (
                <div className="flex items-center mt-1.5">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage src={workshop.mentor.user.image || undefined} alt={workshop.mentor.user.name} />
                    <AvatarFallback>{workshop.mentor.user.name.substring(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-gray-600">With {workshop.mentor.user.name}</p>
                </div>
              )}
            </CardHeader>

            <CardContent className="flex-grow pt-2 pb-3">
              <p className="text-sm text-gray-600 mb-3 min-h-[60px]">
                {truncatedDesc}
                {workshop.description.length > MAX_DESC_LENGTH && (
                  <Link href={`/workshops/${workshop.id}`} className="text-[#3D568F] hover:text-[#2c3e6a] font-medium ml-1">
                    View Details
                  </Link>
                )}
              </p>
              
              <div className="space-y-1.5 text-sm text-gray-500">
                {Array.isArray(workshop.schedule) && workshop.schedule.length > 0 && workshop.schedule.every(s => s.day && s.time) ? (
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-[#3D568F] flex-shrink-0" />
                        <span>{workshop.schedule.map(s => `${s.day} at ${s.time}`).join('; ')}</span>
                    </div>
                ) : typeof workshop.schedule === 'string' && workshop.schedule ? (
                     <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-[#3D568F] flex-shrink-0" />
                        <span>{workshop.schedule}</span>
                    </div>
                ) : workshop.numberOfDays ? (
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-[#3D568F] flex-shrink-0" />
                        <span>{workshop.numberOfDays} day{workshop.numberOfDays > 1 ? 's' : ''} workshop</span>
                    </div>
                ) : null}

                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-[#3D568F] flex-shrink-0" />
                  <span>{workshop._count.enrollments} student{workshop._count.enrollments !== 1 ? 's' : ''} enrolled</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-gray-50 p-3 sm:p-4 flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between items-stretch sm:items-center border-t">
              <div className="text-lg font-bold text-[#3D568F] mb-2 sm:mb-0">
                {formatPrice(workshop.price)}
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Link href={`/workshops/${workshop.id}`} passHref className="flex-1 sm:flex-initial">
                  <Button variant="outline" size="sm" className="w-full transition-all hover:bg-[#3D568F]/10 border-[#3D568F] text-[#3D568F] hover:text-[#2c3e6a]">
                    <Eye className="h-4 w-4 mr-1.5" />
                    Details
                  </Button>
                </Link>
                <Link href={`/workshops/${workshop.id}`} passHref className="flex-1 sm:flex-initial">
                  <Button size="sm" className="w-full bg-[#3D568F] hover:bg-[#2c3e6a] text-white">
                    Enroll Now <ExternalLink className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
