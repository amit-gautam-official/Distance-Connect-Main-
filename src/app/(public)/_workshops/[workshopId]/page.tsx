"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Users,
  Tag,
  ArrowLeft,
  Info,
  Video,
  ListChecks,
  UserCircle,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Lock,
  Clock,
  Star,
  Globe,
  Award,
  Book,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSession } from "next-auth/react";

const PublicWorkshopDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const workshopId = params.workshopId as string;

  

  const {
    data: workshop,
    isLoading,
    isError,
    error,
  } = api.workshop.getPublicWorkshopById.useQuery(
    { id: workshopId },
    { enabled: !!workshopId },
  );

  const handleEnrollRedirect = () => {
    if (session) {
      router.push(`/student-dashboard/workshops/${workshopId}`);
    } else {
      localStorage.setItem(
        "postLoginRedirect",
        `/student-dashboard/workshops/${workshopId}`,
      );
      console.log("Redirecting to login page");
      router.push("/auth/login");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-32 rounded bg-gray-200"></div>
            <div className="h-96 rounded-2xl bg-gray-200"></div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <div className="h-12 rounded bg-gray-200"></div>
                <div className="h-32 rounded-xl bg-gray-200"></div>
                <div className="h-48 rounded-xl bg-gray-200"></div>
              </div>
              <div className="space-y-6">
                <div className="h-40 rounded-xl bg-gray-200"></div>
                <div className="h-48 rounded-xl bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !workshop) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-50 p-6">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            {isError ? "Oops! Something went wrong" : "Workshop Not Found"}
          </h1>
          <p className="mb-8 leading-relaxed text-gray-600">
            {error?.message ||
              "The workshop you're looking for doesn't exist or has been moved."}
          </p>
          <Link href="/workshops">
            <Button className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse All Workshops
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const renderSchedule = () => {
    if (
      !workshop.schedule ||
      (Array.isArray(workshop.schedule) && workshop.schedule.length === 0)
    ) {
      return (
        <p className="italic text-gray-500">Schedule details coming soon...</p>
      );
    }
    return (
      <div className="space-y-3">
        {(workshop.schedule as Array<any>).map((item, index) => (
          <div
            key={index}
            className="flex items-center rounded-lg border border-blue-100 bg-blue-50 p-3"
          >
            <Clock className="mr-3 h-4 w-4 text-blue-600" />
            <span className="font-medium text-gray-700">
              {item.day && item.time ? (
                `${item.day}: ${item.time}`
              ) : item.date && item.time ? (
                <>
                  <span className="font-bold">
                    {new Date(item.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  : {item.time}
                </>
              ) : (
                JSON.stringify(item)
              )}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderCourseDetails = () => {
    if (
      !workshop.courseDetails ||
      typeof workshop.courseDetails !== "object" ||
      Object.keys(workshop.courseDetails).length === 0
    ) {
      return (
        <div className="py-8 text-center text-gray-500">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <p>Detailed curriculum will be available soon!</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {Object.entries(
          workshop.courseDetails as Record<
            string,
            { description: string; isFreeSession?: boolean }
          >,
        )
          .sort(([dayA], [dayB]) => {
            const numA = parseInt(dayA.replace(/\D/g, ""), 10) || 0;
            const numB = parseInt(dayB.replace(/\D/g, ""), 10) || 0;
            return numA - numB;
          })
          .map(([day, details]) => (
            <div
              key={day}
              className="overflow-hidden rounded-xl border border-gray-200 transition-shadow duration-200 hover:shadow-md"
            >
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{day}</h3>
                  {details.isFreeSession && (
                    <Badge className="border-green-200 bg-green-100 text-green-700">
                      Free Preview
                    </Badge>
                  )}
                </div>
              </div>
              <div className="p-4">
                <p className="leading-relaxed text-gray-700">
                  {details.description || (
                    <span className="italic text-gray-400">
                      Details coming soon...
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <div className="container mx-auto px-4 pt-6 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="rounded-full border border-white/20 px-6 py-2 shadow-sm backdrop-blur-sm hover:bg-white/60"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Main Hero Card */}
          <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Banner Section */}
            {workshop.bannerImage ? (
        <div className="relative h-64 overflow-hidden sm:h-80 lg:h-96">
          <img
            src={workshop.bannerImage}
            alt={workshop.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

          {/* Floating Info on Banner */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="mb-4  hidden md:flex  flex-wrap gap-3">
              <Badge className="bg-white/90 px-4 py-2 hover:text-white text-sm font-medium text-gray-900 backdrop-blur-sm">
                <CalendarDays className="mr-2 h-4 w-4" />
                {workshop.numberOfDays} Days
              </Badge>
              <Badge
                className={`px-4 py-2 text-sm font-medium backdrop-blur-sm ${
                  workshop.price === 0
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                <Tag className="mr-2 h-4 w-4" />
                {workshop.price === 0
                  ? "Free Workshop"
                  : `₹${(workshop.price / 100).toLocaleString()}`}
              </Badge>
            </div>
            <button onClick={handleEnrollRedirect}>
              <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl hover:underline underline-offset-4 transition-all duration-300 cursor-pointer">
                {workshop.name}
              </h1>
            </button>
          </div>
        </div>
      ) : (
        <div className="relative h-64 sm:h-80 lg:h-96 bg-gray-200 flex items-center justify-center">
          <div className="text-gray-600 flex flex-col items-center gap-4">
            <Book className="h-12 w-12" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">{workshop.name}</h1>
          </div>
        </div>
      )}

            {/* Content Grid */}
            <div className="p-6 sm:p-8 lg:p-12">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
                {/* Main Content */}
                <div className="space-y-8 lg:col-span-2">
                  {/* Description */}
                  <div className="space-y-4">
                    <h2 className="flex items-center text-2xl font-bold text-gray-900">
                      <Info className="mr-3 h-6 w-6 text-blue-600" />
                      About This Workshop
                    </h2>
                    <div className="prose prose-lg leading-relaxed text-gray-700">
                      <p>{workshop.description}</p>
                    </div>
                  </div>

                  {/* Learning Outcomes */}
                  {workshop.learningOutcomes &&
                    workshop.learningOutcomes.length > 0 && (
                      <div className="space-y-6">
                        <h2 className="flex items-center text-2xl font-bold text-gray-900">
                          <Award className="mr-3 h-6 w-6 text-blue-600" />
                          What You will Master
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {workshop.learningOutcomes.map((outcome, index) => (
                            <div
                              key={index}
                              className="flex items-start rounded-xl border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-4"
                            >
                              <CheckCircle className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                              <span className="font-medium text-gray-800">
                                {outcome}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Schedule */}
                  <div className="space-y-6">
                    <h2 className="flex items-center text-2xl font-bold text-gray-900">
                      <CalendarDays className="mr-3 h-6 w-6 text-blue-600" />
                      Schedule & Timeline
                    </h2>
                    <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                      

                      <div className="mt-4 rounded-lg border border-blue-200 bg-white p-4">
                        <p className="text-lg font-semibold text-gray-900">
                          Workshop begins:{" "}
                          <span className="font-bold">
                            {new Date(
                              workshop?.startDate
                                ? workshop?.startDate
                                // @ts-ignore
                                : workshop?.schedule[0]?.date,
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </p>
                        <div className="mt-2 flex items-center">
                          <p className="text-sm text-gray-600">
                            Schedule Type: {workshop.scheduleType === "recurring" ? "Recurring" : "Specific Dates"}
                          </p>
                          <div className="group relative ml-2">
                            <Info className="h-4 w-4 cursor-help text-gray-400 hover:text-gray-600" />
                            <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 transform whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                              {workshop.scheduleType === "recurring"
                                ? "The sessions will be recurring weekly"
                                : "The sessions will take place on specified dates"}
                              <div className="absolute left-1/2 top-full -translate-x-1/2 transform border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <br/>
                      {renderSchedule()}
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="space-y-6">
                    <h2 className="flex items-center text-2xl font-bold text-gray-900">
                      <BookOpen className="mr-3 h-6 w-6 text-blue-600" />
                      Session Breakdown
                    </h2>
                    {renderCourseDetails()}
                  </div>

                  {/* Additional Info */}
                  {workshop.otherDetails && (
                    <div className="space-y-4">
                      <h2 className="flex items-center text-2xl font-bold text-gray-900">
                        <Globe className="mr-3 h-6 w-6 text-blue-600" />
                        Additional Information
                      </h2>
                      <div className="rounded-2xl border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-6">
                        <p className="leading-relaxed text-gray-800">
                          {workshop.otherDetails}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6 lg:col-span-1">
                  
                  {/* Intro Video - Moved here */}
                  {workshop.introductoryVideoUrl && (
                    <Card className="overflow-hidden border-0 shadow-xl">
                      <CardHeader className="border-b border-red-100 bg-gradient-to-r from-red-50 to-pink-50">
                        <CardTitle className="flex items-center text-xl text-gray-900">
                          <Video className="mr-3 h-6 w-6 text-red-600" />
                          Workshop Preview
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="relative aspect-video bg-gray-100">
                          <iframe
                            src={workshop.introductoryVideoUrl.replace(
                              "watch?v=",
                              "embed/",
                            )}
                            title="Workshop Preview"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="h-full w-full"
                          ></iframe>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                   {/* Mentor Card */}
                  {workshop.mentor && (
                    <Card className="overflow-hidden border-0 shadow-xl">
                      <CardHeader className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
                        <CardTitle className="flex items-center text-xl text-gray-900">
                          <UserCircle className="mr-3 h-6 w-6 text-purple-600" />
                          Meet Your Mentor
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4 text-center">
                          {workshop.mentor.user.image && (
                            <div className="relative mx-auto h-24 w-24">
                              <img
                                src={workshop.mentor.user.image}
                                alt={workshop.mentor.user.name || "Mentor"}
                                className="h-full w-full rounded-full object-cover shadow-lg"
                              />
                              <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-green-500">
                                <CheckCircle className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          )}

                          <div>
                            <Link href={`/mentors/${workshop.mentor.user.id}`}>
                            <h3 className="text-xl font-bold text-gray-900 hover:underline underline-offset-2">
                              {workshop.mentor.user.name || "Expert Mentor"}
                            </h3>
                            </Link>
                            {workshop.mentor.jobTitle && (
                              <p className="font-medium text-purple-600">
                                {workshop.mentor.jobTitle}
                                {workshop.mentor.currentCompany &&
                                  ` at ${workshop.mentor.currentCompany}`}
                              </p>
                            )}
                          </div>

                          {workshop.mentor.bio && (
                            <p className="text-sm leading-relaxed text-gray-700">
                              {workshop.mentor.bio}
                            </p>
                          )}

                          {workshop.mentor.hiringFields &&
                            workshop.mentor.hiringFields.length > 0 && (
                              <div>
                                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                  Expertise
                                </h4>
                                <div className="flex flex-wrap justify-center gap-2">
                                  {workshop.mentor.hiringFields
                                    .slice(0, 4)
                                    .map((skill) => (
                                      <Badge
                                        key={skill}
                                        variant="outline"
                                        className="border-purple-200 bg-purple-50 text-xs text-purple-700"
                                      >
                                        {skill}
                                      </Badge>
                                    ))}
                                  {workshop.mentor.hiringFields.length > 4 && (
                                    <Badge
                                      variant="outline"
                                      className="bg-gray-50 text-xs text-gray-600"
                                    >
                                      +{workshop.mentor.hiringFields.length - 4}{" "}
                                      more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {/* Enrollment Card */}
                  <div className="sticky top-6">
                    <Card className="overflow-hidden border-0 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl">
                      <div className="absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-white/10"></div>
                      <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-12 translate-y-12 rounded-full bg-white/5"></div>

                      <CardHeader className="relative z-10 pb-4 text-center">

                        <CardTitle className="text-2xl font-bold">
                          {workshop.price === 0
                            ? "Join for Free!"
                            : `₹${(workshop.price / 100).toLocaleString()}`}
                        </CardTitle>
                        {workshop.price > 0 && (
                          <p className="text-sm text-blue-100">
                            One-time payment 
                          </p>
                        )}
                      </CardHeader>

                      <CardContent className="relative z-10 space-y-4">
                        <Button
                          size="lg"
                          onClick={handleEnrollRedirect}
                          className="w-full rounded-xl bg-white py-4 text-lg font-bold text-blue-600 shadow-lg transition-all duration-200 hover:bg-blue-50 hover:shadow-xl"
                        >
                          {session ? "Access Workshop" : "Get Started"}
                          {!session && <Lock className="ml-2 h-5 w-5" />}
                        </Button>

                        <p className="text-center text-xs leading-relaxed text-blue-100">
                          {session
                            ? "Click to access your workshop dashboard"
                            : "Create your account or sign in to continue"}
                        </p>

                        <div className="border-t border-white/20 pt-4">
                          <div className="flex items-center justify-center text-sm text-blue-100">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Instant access after enrollment
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  


                 

                  {/* Quick Stats */}
                  {/* <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
                    <CardContent className="p-6">
                      <h3 className="mb-4 text-center font-bold text-gray-900">
                        Workshop Highlights
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-sm text-gray-700">
                            <Clock className="mr-2 h-4 w-4 text-green-600" />
                            Duration
                          </span>
                          <span className="font-semibold text-green-700">
                            {workshop.numberOfDays} Days
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-sm text-gray-700">
                            <Users className="mr-2 h-4 w-4 text-green-600" />
                            Enrolled
                          </span>
                          <span className="font-semibold text-green-700">
                            {workshop._count.enrollments} Students
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-sm text-gray-700">
                            <Star className="mr-2 h-4 w-4 text-green-600" />
                            Level
                          </span>
                          <span className="font-semibold text-green-700">
                            All Levels
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicWorkshopDetailPage;
