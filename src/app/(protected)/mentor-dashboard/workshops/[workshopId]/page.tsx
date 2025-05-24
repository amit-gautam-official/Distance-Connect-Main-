"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { ArrowLeft, Calendar, Clock, Copy, Users, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import EditWorkshopModal from "../_components/EditWorkshopModal";
import { useParams } from 'next/navigation'

export default function WorkshopDetailPage() {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const params = useParams<{ workshopId: string }>();
  const workshopId = params.workshopId;

  // Fetch workshop details
  const {
    data: workshop,
    isLoading,
    refetch,
  } = api.workshop.getWorkshopDetailsByIdForMentor.useQuery(
    { id: workshopId },
    {
      enabled: !!workshopId,
      retry: 1,
    }
  );
  // type Workshop = {
  //   id: string;
  //   name: string;
  //   description: string;
  //   numberOfDays: number;
  //   schedule: { day: string; time: string }[];
  //   price: number;
  //   learningOutcomes: string[];
  //   courseDetails: Record<string, any>;
  //   otherDetails: string | null;
  //   meetUrl: string | null;
  //   createdAt: Date;
  // };

  const workshopDetails = {
    id: workshop?.id ,
    name: workshop?.name,
    description: workshop?.description,
    numberOfDays: workshop?.numberOfDays,
    schedule: workshop?.schedule,
    price: workshop?.price,
    learningOutcomes: workshop?.learningOutcomes,
    courseDetails: workshop?.courseDetails,
    otherDetails: workshop?.otherDetails,
    meetLinks: workshop?.meetLinks,
    createdAt: workshop?.createdAt,
    bannerImage: workshop?.bannerImage,
    introductoryVideoUrl: workshop?.introductoryVideoUrl,
  }

  // Fetch workshop enrollments
  const { data: enrollments, isLoading: isLoadingEnrollments } =
    api.workshop.getWorkshopEnrollments.useQuery(
      { workshopId },
      {
        enabled: !!workshopId,
        retry: 1,
      }
    );

  // Generate meeting link mutation
  const generateMeetLink = api.workshop.generateWorkshopMeetLink.useMutation({
    onSuccess: (data) => {
      toast.success("Meeting links generated successfully");
      void refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleGenerateMeetLink = async (dayIndex?: number) => {
    try {
      await generateMeetLink.mutateAsync({ 
        workshopId: params.workshopId,
        dayIndex: dayIndex
      });
    } catch (error) {
      // Error handled in mutation
      toast.error(error as string);
    }
  };

  const handleCopyMeetLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success("Meeting link copied to clipboard");
  };
  
  // Get workshop day meeting links and status
  const getWorkshopDayLinks = () => {
    // Always return an array of day links, even if meetLinks is not defined yet
    const meetLinks = workshop?.meetLinks as Record<string, any> || {};
    console.log("MeetLinks:", meetLinks);
    console.log("Workshop:", workshop);
    const dayLinks: {dayIndex: number; link: string; scheduledFor: string; canGenerate: boolean; timeUntilAllowed?: string}[] = [];
    
    // Current time
    const now = new Date();
    
    // Extract all day links and status from the meetLinks object
    for (let i = 1; i <= (workshop?.numberOfDays || 0); i++) {
      const dayKey = `day${i}`;
      const scheduleIndex = (i - 1) % (workshop?.schedule as any[] || []).length;
      const scheduleItem = workshop?.schedule?.[scheduleIndex];
      
      if (!scheduleItem) continue;
      
      // Calculate the scheduled date for this day
      const scheduledDate = calculateWorkshopDayDate(i, scheduleItem);
      
      // Check if within 3 hours of the workshop
      const threeHoursBeforeWorkshop = new Date((scheduledDate?.getTime() || 0) - (3 * 60 * 60 * 1000));
      const isWithinTimeWindow = now >= threeHoursBeforeWorkshop;
      
      // Format time until allowed
      let timeUntilAllowed;
      if (!isWithinTimeWindow) {
        const minutesUntilAllowed = Math.ceil((threeHoursBeforeWorkshop.getTime() - now.getTime()) / (60 * 1000));
        if (minutesUntilAllowed < 60) {
          timeUntilAllowed = `${minutesUntilAllowed} minutes`;
        } else {
          const hoursUntilAllowed = Math.floor(minutesUntilAllowed / 60);
          const remainingMinutes = minutesUntilAllowed % 60;
          timeUntilAllowed = `${hoursUntilAllowed} hour${hoursUntilAllowed > 1 ? 's' : ''}${remainingMinutes > 0 ? ` ${remainingMinutes} min` : ''}`;
        }
      }
      
      if (meetLinks[dayKey]?.link) {
        // Link already exists
        dayLinks.push({
          dayIndex: i,
          link: meetLinks[dayKey].link,
          scheduledFor: meetLinks[dayKey].scheduledFor,
          canGenerate: false // Already generated
        });
      } else {
        // Link doesn't exist yet
        dayLinks.push({
          dayIndex: i,
          link: '',
          scheduledFor: scheduledDate?.toISOString() || '',
          canGenerate: isWithinTimeWindow,
          timeUntilAllowed
        });
      }
    }
    
    return dayLinks;
  };
  
  // Helper function to calculate the date for a workshop day
  const calculateWorkshopDayDate = (dayIndex: number, scheduleItem: any) => {
    // Check if we're using a custom schedule (with specific dates) or recurring schedule
    const isCustomSchedule = workshop?.scheduleType === "custom";
    
    if (isCustomSchedule) {
      // For custom schedule, the date is already specified in the scheduleItem
      if (typeof scheduleItem === 'object' && scheduleItem !== null && 'date' in scheduleItem && 'time' in scheduleItem) {
        const customDate = new Date(scheduleItem.date);
        const time = String(scheduleItem.time);
        
        // Parse the time (assuming format like "10:00 AM")
        if (time) {
          const [hourMin, period] = time.split(' ');
          if (hourMin) {
            const [hour, minute] = hourMin.split(':').map(Number);
            
            let hours = hour || 0;
            if (period === 'PM' && hour !== 12) hours += 12;
            if (period === 'AM' && hour === 12) hours = 0;
            
            customDate.setHours(hours, minute || 0, 0, 0);
          }
        }
        
        return customDate;
      }
      return new Date(); // Fallback
    } else {
      // For recurring schedule
      const dayMap: Record<string, number> = {
        "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3, 
        "Thursday": 4, "Friday": 5, "Saturday": 6
      };
      
      // Get the start date if available, otherwise use current date
      let startDate = new Date();
      if (workshop?.startDate) {
        startDate = new Date(workshop.startDate);
      }
      
      // Get all scheduled days in the workshop
      const schedule = workshop?.schedule as any[] || [];
      if (!schedule.length) return new Date(); // Fallback if no schedule
      
      // Create an ordered list of workshop days based on the start date
      const workshopDays: {day: number; scheduleIndex: number; date: Date}[] = [];
      
      // First, determine the first occurrence of each scheduled day after the start date
      for (let i = 0; i < schedule.length; i++) {
        const scheduleItem = schedule[i];
        const day = typeof scheduleItem === 'object' && scheduleItem !== null && 'day' in scheduleItem
          ? String(scheduleItem.day) : '';
        const time = typeof scheduleItem === 'object' && scheduleItem !== null && 'time' in scheduleItem
          ? String(scheduleItem.time) : '';
        
        const dayOfWeek = dayMap[day];
        if (dayOfWeek === undefined) continue;
        
        // Calculate days to add to reach this day from the start date
        const startDayOfWeek = startDate.getDay();
        let daysToAdd = 0;
        
        // If the day is before or equal to the start day of week, find the next occurrence
        if (dayOfWeek < startDayOfWeek) {
          daysToAdd = 7 - (startDayOfWeek - dayOfWeek);
        } else if (dayOfWeek > startDayOfWeek) {
          daysToAdd = dayOfWeek - startDayOfWeek;
        } else {
          // Same day of week as start date
          // If the workshop starts today, count today as day 1
          daysToAdd = 0;
        }
        
        // Create a date for this workshop day
        const workshopDate = new Date(startDate);
        workshopDate.setDate(startDate.getDate() + daysToAdd);
        
        // Parse and set the time
        if (time) {
          const [hourMin, period] = time.split(' ');
          if (hourMin) {
            const [hour, minute] = hourMin.split(':').map(Number);
            
            let hours = hour || 0;
            if (period === 'PM' && hour !== 12) hours += 12;
            if (period === 'AM' && hour === 12) hours = 0;
            
            workshopDate.setHours(hours, minute || 0, 0, 0);
          }
        }
        
        workshopDays.push({
          day: dayOfWeek,
          scheduleIndex: i,
          date: workshopDate
        });
      }
      
      // Sort workshop days by date
      workshopDays.sort((a, b) => a.date.getTime() - b.date.getTime());
      
      // Now calculate the date for the specific day index
      if (dayIndex <= 0 || !workshopDays.length) return new Date(); // Invalid index
      
      // For day 1, return the first scheduled day
      if (dayIndex === 1) {
        return workshopDays[0]?.date;
      }
      
      // For subsequent days, calculate based on the pattern
      const baseDay = workshopDays[0];
      const daysBetweenSessions = 7; // Assuming weekly recurrence
      
      // Calculate which occurrence of the pattern we need
      const occurrenceIndex = Math.floor((dayIndex - 1) / workshopDays.length);
      const patternIndex = (dayIndex - 1) % workshopDays.length;
      
      // Get the pattern day
      const patternDay = workshopDays[patternIndex];
      
      // Calculate the date
      const resultDate = new Date(patternDay?.date || new Date());
      resultDate.setDate(resultDate.getDate() + (occurrenceIndex * daysBetweenSessions));
      
      return resultDate;
    }
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    void refetch();
    toast.success("Workshop updated successfully");
  };

  // Format price to INR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price / 100); // Convert paise to rupees
  };

// Loading state
if (isLoading) {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-gray-100">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Skeleton className="h-8 w-64" />
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Skeleton className="h-64 w-full" />
        </div>
        <div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}

// Workshop not found
if (!workshop) {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">Workshop not found</h2>
        <p className="mt-2 text-gray-600">
          The workshop you&apos;re looking for doesn&apos;t exist or you don&apos;t have
          permission to view it.
        </p>
      </div>
    </div>
  );
}

return (
  <div className="container mx-auto px-2 sm:px-6 py-4 pb-16 md:pb-6 sm:py-6 space-y-6 sm:space-y-8">
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
      <Button
        variant="ghost"
        onClick={() => router.push("/mentor-dashboard/workshops")}
        className="h-8 w-8 p-0"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-2xl font-bold text-gray-900">{workshop.name}</h1>
      <Button
        variant="outline"
        onClick={() => setIsEditModalOpen(true)}
        className="ml-auto"
      >
        Edit Workshop
      </Button>
    </div>

    {workshopDetails.bannerImage && (
      <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
        <img
          src={workshopDetails.bannerImage}
          alt={`${workshopDetails.name ?? 'Workshop'} banner`}
          className="w-full h-auto object-cover max-h-[250px] sm:max-h-[300px] md:max-h-[350px] lg:max-h-[400px]"
        />
      </div>
    )}

    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-2/3">
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-gray-100">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="students">
              Students ({enrollments?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card className="transition-all duration-300 hover:shadow-md bg-white/80 backdrop-blur-sm border border-gray-100">
              <CardHeader>
                <CardTitle>Workshop Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 text-gray-900 text-wrap">{workshop.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                    <p className="mt-1 text-gray-900">{workshop.numberOfDays} days</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Price</h3>
                    <p className="mt-1 text-gray-900 font-bold text-primary">
                      {formatPrice(workshop.price)}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Schedule</h3>
                  <div className="mt-1 space-y-1">
                    {workshop.scheduleType === "recurring" ? (
                      <>
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-900 font-medium">
                            Recurring from {new Date(workshop?.startDate || "").toLocaleDateString()}
                          </span>
                        </div>
                        {workshop.schedule.map((item: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 ml-6">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-900">
                              {item.day} at {item.time}
                            </span>
                          </div>
                        ))}
                      </>
                    ) : (
                      // Custom schedule
                      <>
                        {workshop.schedule.map((item: any, index: number) => {
                          const sessionDate = new Date(item.date);
                          return (
                            <div key={index} className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-900">
                                {sessionDate.toLocaleDateString(undefined, {
                                  weekday: 'long',
                                  month: 'short',
                                  day: 'numeric'
                                })} at {item.time}
                              </span>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Learning Outcomes</h3>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    {workshop.learningOutcomes.map((outcome: string, index: number) => (
                      <li key={index} className="text-gray-900">
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Course Details</h3>
                  <div className="mt-2 space-y-3">
                    {workshop.courseDetails && typeof workshop.courseDetails === 'object' && !Array.isArray(workshop.courseDetails) && 
                      Object.entries(workshop.courseDetails as Record<string, { description: string; isFreeSession: boolean }>).map(([day, content], index) => {
                        const dayNumber = parseInt(day.replace(/[^0-9]/g, ''));
                        const dayLink = getWorkshopDayLinks().find(link => link.dayIndex === dayNumber);
                        const scheduleIndex = (dayNumber - 1) % (workshop.schedule as any[]).length;
                        const scheduleItem = workshop.schedule[scheduleIndex];
                        const sessionDate = calculateWorkshopDayDate(dayNumber, scheduleItem);
                        
                        return (
                          <div key={day} className="bg-gray-50 p-3 rounded-md">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium text-gray-900">{day}</h4>
                              <div className="text-sm text-gray-500">
                                {sessionDate?.toLocaleDateString(undefined, {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                            </div>
                            <p className="mt-1 mb-3 text-gray-700">{(content as { description: string; isFreeSession: boolean }).description}</p>
                            
                            {/* Meeting link section - Always show a placeholder */}
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              {dayLink ? (
                                dayLink.link ? (
                                  // Meeting link already generated
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm">
                                      <Video className="h-4 w-4 text-green-500" />
                                      <span className="text-green-600 font-medium">Meeting link ready</span>
                                    </div>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handleCopyMeetLink(dayLink.link)}
                                      className="flex items-center gap-1 hover:bg-primary/5 transition-all"
                                    >
                                      <Copy className="h-3 w-3" />
                                      Copy Link
                                    </Button>
                                  </div>
                                ) : dayLink.canGenerate ? (
                                  // Can generate now - within 3 hours of meeting time
                                  <div>
                                    <div className="flex items-center gap-2 mb-2 text-sm">
                                      <Video className="h-4 w-4 text-blue-500" />
                                      <span className="text-blue-600 font-medium">Meeting starts soon</span>
                                    </div>
                                    <Button
                                      size="sm"
                                      className="w-full bg-primary hover:bg-primary/90 transition-all"
                                      onClick={() => handleGenerateMeetLink(dayNumber)}
                                      disabled={generateMeetLink.isPending}
                                    >
                                      {generateMeetLink.isPending
                                        ? "Generating..."
                                        : "Generate Meeting Link"}
                                    </Button>
                                  </div>
                                ) : (
                                  // Not within 3 hours - cannot generate yet
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm">
                                      <Video className="h-4 w-4 text-gray-400" />
                                      <span className="text-gray-500">Meeting link placeholder</span>
                                    </div>
                                    <div className="text-xs text-amber-700 font-medium">
                                      Available in {dayLink.timeUntilAllowed}
                                    </div>
                                  </div>
                                )
                              ) : (
                                // Fallback if dayLink is not available
                                <div className="flex items-center gap-2 text-sm">
                                  <Video className="h-4 w-4 text-gray-400" />
                                  <span className="text-gray-500">Meeting link will be available closer to the session</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                  
                  {/* Show info about 3-hour restriction */}
                  <div className="mt-4 pt-4 border-t border-border text-sm text-gray-500 bg-gray-50/50 p-3 rounded-md">
                    <p className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Meeting links can only be generated within 3 hours of each session&apos;s start time
                    </p>
                  </div>
                </div>

                {workshop.otherDetails && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Other Details</h3>
                    <p className="mt-1 text-gray-900">{workshop.otherDetails}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card className="transition-all duration-300 hover:shadow-md bg-white/80 backdrop-blur-sm border border-gray-100">
              <CardHeader>
                <CardTitle>Enrolled Students</CardTitle>
                <CardDescription>
                  Students who have enrolled and paid for this workshop
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingEnrollments ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-2 py-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : enrollments && enrollments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Enrolled On</TableHead>
                        
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollments.map((enrollment : any) => (
                        <TableRow key={enrollment.id}>
                          <TableCell className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 md:h-8 md:w-8">
                              <AvatarImage
                                src={enrollment.student.user.image || ""}
                                alt={enrollment.student.user.name || ""}
                              />
                              <AvatarFallback>
                                {enrollment.student.user.name
                                  ?.charAt(0)
                                  .toUpperCase() || "S"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-xs md:text-base">
                              {enrollment.student.user.name ||
                                enrollment.student.studentName ||
                                "Student"}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs md:text-base">{enrollment.student.user.email}</TableCell>
                          <TableCell className="text-xs md:text-base">
                            {new Date(enrollment.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-6">
                    <Users className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      No students enrolled yet
                    </h3>
                    <p className="mt-1 text-gray-500">
                      Students will appear here once they enroll and pay for your workshop
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="w-full lg:w-1/3 space-y-6">
        {workshopDetails.introductoryVideoUrl && (
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Introductory Video</h3>
            <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg bg-gray-900">
              <video
                src={workshopDetails.introductoryVideoUrl}
                controls
                className="w-full h-full object-contain"
                poster={workshopDetails.bannerImage || undefined}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}

        <Card className="transition-all w-full duration-300 hover:shadow-md bg-white/80 backdrop-blur-sm border border-gray-100">
          <CardHeader>
            <CardTitle>Workshop Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Enrolled Students</span>
              <Badge variant="secondary">
                {enrollments?.length || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Revenue</span>
              <span className="font-medium">
                {formatPrice((enrollments?.length || 0) * workshop.price)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Created On</span>
              <span className="text-sm">
                {new Date(workshop.createdAt).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>

    {/* Edit workshop modal */}
    {isEditModalOpen && (
      <EditWorkshopModal
        workshop={workshopDetails as any}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
      />
    )}
  </div>
  );
}
