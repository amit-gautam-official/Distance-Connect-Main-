"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { ArrowLeft, Calendar, Clock, ExternalLink, Users, Video, Lock, IndianRupee } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

declare global {
  interface Window {
    Razorpay: any; // For Razorpay Checkout
  }
}

interface WorkshopCountdown {
  days: number;
  hours: number;
  minutes: number;
  isPast: boolean;
  scheduledFor: Date;
}

const calculateTimeDifference = (targetDate: Date | null, now: Date): WorkshopCountdown => {
  if (!targetDate || isNaN(targetDate.getTime())) {
    return { days: 0, hours: 0, minutes: 0, isPast: true, scheduledFor: new Date(0) }; // Return a clearly past date
  }

  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, isPast: true, scheduledFor: targetDate };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, isPast: false, scheduledFor: targetDate };
};

const calculateWorkshopDayDate = (workshop: any, dayIndex: number, scheduleItem: any): WorkshopCountdown => {
  const now = new Date(); // Get current time once
  const isCustomSchedule = workshop?.scheduleType === "custom";

  if (isCustomSchedule) {
    if (typeof scheduleItem === 'object' && scheduleItem !== null && 'date' in scheduleItem && 'time' in scheduleItem) {
      const customDate = new Date(scheduleItem.date as string);
      const time = String(scheduleItem.time);

      if (time) {
        const [hourMin, period] = time.split(' ');
        if (hourMin) {
          const [hourStr, minuteStr] = hourMin.split(':');
          const hour = parseInt(hourStr || "0", 10);
          const minute = parseInt(minuteStr || "0", 10);
          
          let hours = hour || 0;
          if (period === 'PM' && hour !== 12) hours += 12;
          if (period === 'AM' && hour === 12) hours = 0;
          
          customDate.setHours(hours, minute || 0, 0, 0);
        }
      }
      return calculateTimeDifference(customDate, now);
    }
    return calculateTimeDifference(null, now); 
  } else { 
    const dayMap: Record<string, number> = {
      "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3, 
      "Thursday": 4, "Friday": 5, "Saturday": 6
    };
    
    let startDate = new Date();
    if (workshop?.startDate) {
      startDate = new Date(workshop.startDate as string | Date);
    }
    
    const schedule = workshop?.schedule as any[] || [];
    if (!schedule.length) return calculateTimeDifference(null, now); 
    
    const workshopDays: {day: number; scheduleIndex: number; date: Date}[] = [];
    
    for (let i = 0; i < schedule.length; i++) {
      const currentScheduleItem = schedule[i];
      const day = typeof currentScheduleItem === 'object' && currentScheduleItem !== null && 'day' in currentScheduleItem
        ? String(currentScheduleItem.day) : '';
      const time = typeof currentScheduleItem === 'object' && currentScheduleItem !== null && 'time' in currentScheduleItem
        ? String(currentScheduleItem.time) : '';
      
      const dayOfWeek = dayMap[day];
      if (dayOfWeek === undefined) continue;
      
      const startDayOfWeek = startDate.getDay();
      let daysToAdd = 0;
      
      if (dayOfWeek < startDayOfWeek) {
        daysToAdd = 7 - (startDayOfWeek - dayOfWeek);
      } else if (dayOfWeek > startDayOfWeek) {
        daysToAdd = dayOfWeek - startDayOfWeek;
      } else {
        daysToAdd = 0;
      }
      
      const workshopDate = new Date(startDate);
      workshopDate.setDate(startDate.getDate() + daysToAdd);
      
      if (time) {
        const [hourMin, period] = time.split(' ');
        if (hourMin) {
          const [hourStr, minuteStr] = hourMin.split(':');
          const hour = parseInt(hourStr || "0", 10);
          const minute = parseInt(minuteStr || "0", 10);

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
    
    workshopDays.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    if (dayIndex <= 0 || !workshopDays.length) return calculateTimeDifference(null, now); 
    
    if (dayIndex === 1) {
      return calculateTimeDifference(workshopDays[0]?.date || null, now);
    }
    
    const baseDayInfo = workshopDays[(dayIndex - 1) % workshopDays.length];
    if (!baseDayInfo) return calculateTimeDifference(null, now);

    const weekOffset = Math.floor((dayIndex - 1) / workshopDays.length);
    const resultDate = new Date(baseDayInfo.date);
    resultDate.setDate(resultDate.getDate() + weekOffset * 7);
    
    return calculateTimeDifference(resultDate, now);
  }
};

export default function WorkshopDetailPage() {
  const router = useRouter();
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [studentGmailId, setStudentGmailId] = useState<string>("");
  // Unwrap params using React.use()
  const params = useParams<{ workshopId: string }>();
  const workshopId = params.workshopId;

  // Fetch workshop details
  const {
    data: workshop,
    isLoading,
  } = api.workshop.getWorkshopById.useQuery(
    { id: workshopId },
    {
      enabled: !!workshopId,
      retry: 1,
    }
  );

  // Check if student is enrolled
  const { data: enrolledWorkshops, isLoading: isLoadingEnrolled, refetch: refetchEnrolled } = 
    api.workshop.getEnrolledWorkshops.useQuery();
  
  const isEnrolled = enrolledWorkshops?.some(
    (enrollment) => enrollment.workshop.id === workshopId
  );

  const isPaid = enrolledWorkshops?.some(
    (enrollment) => enrollment.workshop.id === workshopId && enrollment.paymentStatus
  );

  // Enroll in workshop mutation
  const enrollInWorkshop = api.workshop.enrollInWorkshop.useMutation({
    onSuccess: () => {
      toast.success("Successfully enrolled in workshop!");
      setIsEnrollDialogOpen(false);
      void refetchEnrolled();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createOrderMutation = api.razorpayOrder.createWorkshopPaymentOrder.useMutation();

  const handleEnroll = async () => {
    try {
      await enrollInWorkshop.mutateAsync({ 
        workshopId: params.workshopId,
        studentGmailId: studentGmailId,
      });
    } catch (error) {
      // Error handled in the mutation
    }
  };

  const handlePayment = async () => {
    if (!workshop || workshop.price == null || workshop.price <= 0) {
      toast.error("This workshop is free or the price is not set.");
      return;
    }
    if (!isEnrolled) {
      toast.error("You are not enrolled in this workshop.");
      return;
    }

    setIsProcessingPayment(true);
    try {
      const orderDetails = await createOrderMutation.mutateAsync({ workshopId: params.workshopId });

      const options = {
        key: orderDetails.razorpayKeyId,
        amount: orderDetails.amount, 
        currency: orderDetails.currency,
        name: "Distance Connect Workshops",
        description: `Payment for ${orderDetails.workshopName}`,
        order_id: orderDetails.orderId,
        handler: async function (response: any) {
          setIsProcessingPayment(true); // Keep loading indicator active during verification
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
          
          try {
            const verifyRes = await fetch('/api/payment/ws-verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.verified) {
              toast.success("Payment verified successfully! Your enrollment is confirmed.");
              refetchEnrolled(); 
            } else {
              toast.error(verifyData.error || "Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Verification API error:", err);
            toast.error("An error occurred during payment verification. We'll update your status soon via webhook if payment was successful.");
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: enrolledWorkshops?.find(enrollment => enrollment.workshop.id === workshopId)?.student?.user?.name ?? undefined, 
          email: enrolledWorkshops?.find(enrollment => enrollment.workshop.id === workshopId)?.student?.user?.email ?? undefined,
        },
        notes: orderDetails.notes,
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function() {
            toast.info("Payment window closed. If you made a payment, it will be processed.");
            setIsProcessingPayment(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error: any) {
      console.error("Payment failed", error);
      toast.error(error.message || "Payment failed. Please try again.");
    } finally {
      // setIsProcessingPayment(false); // Moved to ondismiss and handler completion
    }
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
  if (isLoading || isLoadingEnrolled) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
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
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Workshop not found</h2>
          <p className="mt-2 text-gray-600">
            The workshop you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button onClick={() => router.push("/student-dashboard/workshops")} className="mt-4">
            Back to Workshops
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-br from-slate-50 to-sky-100/30 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/student-dashboard/workshops")}
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">{workshop.name}</h1>
        {isEnrolled && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Enrolled
          </Badge>
        )}
      </div>

      {/* Banner Image */}
      {workshop.bannerImage && (
        <div className="mb-6 rounded-lg overflow-hidden shadow-lg">
          <img
            src={workshop.bannerImage}
            alt={`${workshop.name} banner`}
            className="w-full h-auto object-cover max-h-[250px] sm:max-h-[300px] md:max-h-[350px] lg:max-h-[400px]"
          />
        </div>
      )}

      {/* Main content: Two-column layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column: Workshop Details */}
        <div className="md:w-2/3 space-y-6">
          <Card className="transition-all duration-300 hover:shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-primary/10">
                  <AvatarImage src={workshop.mentor.user.image || undefined} />
                  <AvatarFallback>{workshop.mentor.user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{workshop.name}</CardTitle>
                  <CardDescription>
                    <Link className="" href={`/mentors/${workshop.mentor.user.id}`}>
                      by <span className="text-blue-600 hover:underline">@{workshop.mentor.mentorName || workshop.mentor.user.name}</span>
                    </Link>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="mt-2">
                <h3 className="text-lg font-medium">Description</h3>
                <p className="mt-2 text-gray-700">{workshop.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium">Schedule</h3>
                <div className="mt-2 space-y-2">
                  {(workshop.schedule as any[])?.map((item: any, index: number) => {
                    const dayNumber = index + 1;
                    const sessionDate = calculateWorkshopDayDate(workshop, dayNumber, item);
                    const itemTime = (typeof item === 'object' && item !== null && 'time' in item && item.time) ? String(item.time) : '';
                    const itemDayOrDate = workshop.scheduleType === 'recurring' 
                      ? (typeof item === 'object' && item !== null && 'day' in item && item.day ? String(item.day) : `Session ${dayNumber}`) 
                      : sessionDate.scheduledFor.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

                    return (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                        <Calendar className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                        <div className="flex-grow">
                          <p className="font-semibold text-gray-800">
                            {workshop.scheduleType === 'recurring' ? `Day ${dayNumber}: ${itemDayOrDate}` : itemDayOrDate}
                          </p>
                          <p className="text-sm text-gray-600">
                            {sessionDate.isPast ? (
                              `Passed: ${sessionDate.scheduledFor.toLocaleDateString(undefined, {
                                weekday: 'short', month: 'short', day: 'numeric'
                              })}${itemTime ? `, ${itemTime}` : ''}`
                            ) : (
                              `Starts in: ${sessionDate.days}d ${sessionDate.hours}h ${sessionDate.minutes}m${itemTime ? ` (at ${itemTime})` : ''}`
                            )}
                          </p>
                          {typeof item === 'object' && item !== null && 'description' in item && item.description && (
                            <p className="text-xs text-gray-500 mt-1 italic">{(item as {description: string}).description}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Learning Outcomes</h3>
                <ul className="mt-2 list-disc list-inside space-y-1 text-gray-700">
                  {workshop.learningOutcomes.map((outcome: string, index: number) => (
                    <li key={index}>{outcome}</li>
                  ))}
                </ul>
              </div>

              {/* {workshop.courseDetails && (
                <div>
                  <h3 className="text-lg font-medium">Course Details</h3>
                  <div className="mt-2 space-y-4">
                    {Object.entries(workshop.courseDetails).map(([day, content]) => (
                      <div key={day} className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium text-gray-900">{day}</h4>
                        <p className="mt-1 text-gray-700">{(content as { description: string; isFreeSession: boolean }).description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}

              {workshop.otherDetails && (
                <div>
                  <h3 className="text-lg font-medium">Additional Information</h3>
                  <p className="mt-2 text-gray-700">{workshop.otherDetails}</p>
                </div>
              )}
                    {/* Session Breakdown */}
      {workshop.courseDetails && Object.keys(workshop.courseDetails).length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm">
          <h3 className="text-lg font-medium">Session Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(workshop.courseDetails as Record<string, { description: string; isFreeSession: boolean }>)
              .sort(([dayA], [dayB]) => {
                const numA = parseInt(dayA.replace(/\D/g, ''), 10) || 0;
                const numB = parseInt(dayB.replace(/\D/g, ''), 10) || 0;
                return numA - numB;
              })
              .map(([day, details]) => {
                const isWorkshopPaid = workshop.price > 0;
                let sessionStatusType: 'free' | 'included' | 'unlocked' | 'locked';
                let badgeConfig: { text: string; variant: "outline" | "destructive"; icon?: React.ElementType; className?: string };

                if (details.isFreeSession) {
                  sessionStatusType = 'free';
                  badgeConfig = { text: "Free Session", variant: "outline", className: "bg-green-100 text-green-700 border-green-200" };
                } else if (!isWorkshopPaid) { // Workshop itself is free, session is not marked free (so it's included)
                  sessionStatusType = 'included';
                  badgeConfig = { text: "Included", variant: "outline", className: "bg-blue-100 text-blue-700 border-blue-200" };
                } else if(isPaid){ // Student have paid for the workshop
                  sessionStatusType = 'unlocked';
                  badgeConfig = { text: "Unlocked", variant: "outline", className: "bg-green-100 text-green-700 border-green-200" };
                }
                else { // Workshop is PAID, and this session is NOT free. Requires purchase.
                  sessionStatusType = 'locked'; // Stays locked until a separate purchase action
                  badgeConfig = { text: "Requires Purchase", variant: "destructive", icon: Lock };
                }
                const isSessionEffectivelyLocked = sessionStatusType === 'locked';

                return (
                  <div 
                    key={day} 
                    className={`p-3.5 rounded-lg border shadow-sm ${ 
                      isSessionEffectivelyLocked 
                        ? 'bg-slate-50 border-slate-200'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <h4 className="font-medium text-gray-900">{day}</h4>
                      <Badge variant={badgeConfig.variant} className={`text-xs px-2.5 py-0.5 ${badgeConfig.className || ''}`}>
                        {badgeConfig.icon && <badgeConfig.icon className="h-3 w-3 mr-1.5 inline-block align-middle" />}
                        <span className="align-middle">{badgeConfig.text}</span>
                      </Badge>
                    </div>
                    <p className={`text-sm ${isSessionEffectivelyLocked ? 'text-slate-500' : 'text-slate-700'}`}>
                      {(details as { description: string; isFreeSession: boolean }).description || <span className="italic text-slate-400">No description provided.</span>}
                    </p>
                    {isSessionEffectivelyLocked && (
                      <p className="text-xs text-amber-700 mt-2 font-medium">
                        {isWorkshopPaid && !details.isFreeSession 
                          ? "Purchase the workshop to access this session."
                          : "Enroll in the workshop to access this session."}
                      </p>
                    )}
                  </div>
                );
            })}
          </div>
        </div>
      )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Video, Metadata, Actions */}
        <div className="md:w-1/3 space-y-6">
          {/* Introductory Video */}
          {workshop.introductoryVideoUrl && (
            <div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Introductory Video</h3>
              <div className="aspect-video w-full rounded-lg overflow-hidden shadow-xl bg-gray-900">
                <video
                  src={workshop.introductoryVideoUrl}
                  controls
                  className="w-full h-full object-contain"
                  poster={workshop.bannerImage || undefined}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          )}
          {isEnrolled && (
            <Card className="transition-all w-full duration-300 hover:shadow-md bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Your Enrollment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50/80 backdrop-blur-sm text-green-700 p-3 sm:p-4 rounded-md shadow-sm border border-green-100">
                  <p className="font-medium">You&apos;re enrolled in this workshop!</p>
                  <p className="mt-1 text-sm">
                  Meeting links will be available 3 hours before the scheduled time. You will receive an email with the details accordingly.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Price, Mentor, etc. */}
          <Card className="transition-all w-full duration-300 hover:shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Workshop Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Price</span>
                <div className="mt-4 text-lg font-bold text-primary bg-primary/5 inline-block px-3 py-1 rounded-full">
                  {formatPrice(workshop.price)}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Duration</span>
                <span>{workshop.numberOfDays} day{workshop.numberOfDays > 1 ? "s" : ""}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Created</span>
                <span>{new Date(workshop.createdAt).toLocaleDateString()}</span>
              </div>

              {!isEnrolled ? (
                <Button 
                  className="w-full mt-4" 
                  onClick={() => setIsEnrollDialogOpen(true)}
                >
                  Enroll Now
                </Button>
              ) : workshop.price > 0 && !isPaid ? (
                <div className="mt-6">
                  <Button 
                    onClick={handlePayment} 
                    disabled={isProcessingPayment || createOrderMutation.isPending}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isProcessingPayment || createOrderMutation.isPending ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <IndianRupee className="mr-2 h-4 w-4" />
                        Pay for Workshop (₹{workshop.price / 100})
                      </>
                    )}
                  </Button>
                </div>
              ) : workshop.price === 0 || isPaid ? (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-xs">
                  You have already paid for this workshop.
                </div>
              ) : (
                <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-md text-orange-700 text-xs">
                  This workshop is free.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enrollment Button / Status */}
          {/* {!isEnrolled && workshop.price > 0 && (
            <Card className="transition-all w-full duration-300 hover:shadow-md bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Enroll in Workshop</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full mt-4" 
                  onClick={() => setIsEnrollDialogOpen(true)}
                >
                  Enroll Now
                </Button>
              </CardContent>
            </Card>


          )} */}

          
          

          {/* Meeting Links (if enrolled) */}
          {isEnrolled && workshop.meetLinks && Object.keys(workshop.meetLinks).length > 0 && (
            <Card className="transition-all w-full duration-300 hover:shadow-md bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Meeting Links</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Display meeting links for each day */}
                <div className="space-y-2">
                  {Object.entries(workshop.meetLinks as Record<string, any>).map(([key, value]) => {
                    const dayNumber = key.replace('day', '');
                    const scheduledDate = new Date(value.scheduledFor);
                    const formattedDate = scheduledDate.toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                    
                    return (
                      <div key={key} className="border rounded-md p-2 sm:p-3 hover:border-primary/20 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Day {dayNumber}</span>
                          <span className="text-xs text-gray-500">{formattedDate}</span>
                        </div>
                        <Button 
                          className="w-full transition-all hover:shadow-md"
                          onClick={() => window.open(value.link, "_blank")}
                          size="sm"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Join Session {dayNumber}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          
        </div>
      </div>



      {/* Enrollment confirmation dialog */}
      
<Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Enrollment</DialogTitle>
      <DialogDescription>
        Are you sure you want to enroll in &quot;{workshop.name}&quot;?
        <br />
        This will give you access to the workshop materials and meeting links.
      </DialogDescription>
    </DialogHeader>

    <div className="py-2">
      <Input
        type="email"
        placeholder="Enter your email (GMAIL) for Google Meet"
        value={studentGmailId}
        onChange={(e) => setStudentGmailId(e.target.value)}
      />
    </div>

    <DialogFooter>
      <Button variant="outline" onClick={() => setIsEnrollDialogOpen(false)}>
        Cancel
      </Button>
      <Button
        onClick={handleEnroll}
        disabled={enrollInWorkshop.isPending}
      >
        {enrollInWorkshop.isPending ? "Processing..." : "Confirm Enrollment"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </div>
  );
}
