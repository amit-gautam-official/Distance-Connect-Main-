"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, Tag, ArrowLeft, Info, Video, ListChecks, UserCircle, BookOpen, AlertTriangle, CheckCircle, ExternalLink, Lock } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSession } from 'next-auth/react';

const PublicWorkshopDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession()
  const workshopId = params.workshopId as string;

  const { data: workshop, isLoading, isError, error } = api.workshop.getPublicWorkshopById.useQuery(
    { id: workshopId },
    { enabled: !!workshopId }
  );

  const handleEnrollRedirect = () => {
    if (session) {
      router.push(`/student-dashboard/workshops/${workshopId}`);
    } else {
      // Store intended destination and redirect to login
      localStorage.setItem('postLoginRedirect', `/student-dashboard/workshops/${workshopId}`);
      router.push('/auth/login'); 
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div> {/* Back button placeholder */}
          <div className="h-72 bg-gray-200 rounded-lg mb-6"></div> {/* Banner placeholder */}
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div> {/* Title placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="h-20 bg-gray-200 rounded"></div> {/* Description placeholder */}
              <div className="h-32 bg-gray-200 rounded"></div> {/* Learning outcomes placeholder */}
              <div className="h-40 bg-gray-200 rounded"></div> {/* Course details placeholder */}
            </div>
            <div className="space-y-4">
              <div className="h-24 bg-gray-200 rounded"></div> {/* Price/Enroll card placeholder */}
              <div className="h-32 bg-gray-200 rounded"></div> {/* Mentor card placeholder */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !workshop) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-red-600 mb-2">
          {isError ? 'Error Loading Workshop' : 'Workshop Not Found'}
        </h1>
        <p className="text-gray-700 mb-6">
          {error?.message || "The workshop you are looking for does not exist or an error occurred."}
        </p>
        <Link href="/workshops" passHref>
          <Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Workshops</Button>
        </Link>
      </div>
    );
  }

  // Helper to render schedule
  const renderSchedule = () => {
    if (!workshop.schedule || (Array.isArray(workshop.schedule) && workshop.schedule.length === 0)) {
      return <p className="text-sm text-gray-500">Schedule details not available yet.</p>;
    }
    return (
      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
        {(workshop.schedule as Array<any>).map((item, index) => (
          <li key={index}>
            {item.day && item.time ? `${item.day}: ${item.time}` : 
             item.date && item.time ? `${new Date(item.date).toLocaleDateString()}: ${item.time}` : 
             JSON.stringify(item) }
          </li>
        ))}
      </ul>
    );
  };
  
  const renderCourseDetails = () => {
    if (!workshop.courseDetails || typeof workshop.courseDetails !== 'object' || Object.keys(workshop.courseDetails).length === 0) {
      return <p className="text-sm text-gray-500">Detailed session breakdown will be available soon.</p>;
    }
    return (
      <Accordion type="single" collapsible className="w-full">
        {Object.entries(workshop.courseDetails as Record<string, { description: string; isFreeSession?: boolean }>)
          .sort(([dayA], [dayB]) => {
            const numA = parseInt(dayA.replace(/\D/g, ''), 10) || 0;
            const numB = parseInt(dayB.replace(/\D/g, ''), 10) || 0;
            return numA - numB;
          })
          .map(([day, details]) => (
          <AccordionItem value={day} key={day}>
            <AccordionTrigger className="text-base font-medium hover:no-underline">
              <div className="flex justify-between items-center w-full">
                <span>{day}</span>
                {details.isFreeSession && <Badge className='bg-green-100 text-green-700 border-green-200 ml-2'>Free Session</Badge>}
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-gray-700 pl-2">
              {details.description || <span className="italic text-gray-400">No description provided.</span>}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>

        <div className="lg:flex lg:gap-x-8">
          {/* Main Content */} 
          <div className="lg:w-2/3">
            {workshop.bannerImage && (
              <div className="relative h-64 md:h-80 lg:h-96 w-full rounded-xl overflow-hidden shadow-lg mb-6">
                <img src={workshop.bannerImage} alt={workshop.name} className="w-full h-full object-cover" />
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">{workshop.name}</h1>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary" className="text-sm py-1 px-3"><CalendarDays className="h-4 w-4 mr-1.5" /> {workshop.numberOfDays} Days</Badge>
              <Badge variant="secondary" className="text-sm py-1 px-3"><Users className="h-4 w-4 mr-1.5" /> {workshop._count.enrollments} Enrolled</Badge>
              <Badge variant={workshop.price === 0 ? "default" : "secondary"} className={`text-sm py-1 px-3 ${workshop.price === 0 ? 'bg-green-100 text-green-700' : 'bg-sky-100 text-sky-700'}`}>
                <Tag className="h-4 w-4 mr-1.5" />
                {workshop.price === 0 ? 'Free' : `₹${(workshop.price / 100).toFixed(2)}`}
              </Badge>
            </div>

            {workshop.introductoryVideoUrl && (
              <Card className="mb-6 bg-white shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl"><Video className="h-5 w-5 mr-2 text-sky-600" /> Introductory Video</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                    <iframe 
                      src={workshop.introductoryVideoUrl.replace("watch?v=", "embed/")} 
                      title="Introductory Video" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="mb-6 bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center text-xl"><Info className="h-5 w-5 mr-2 text-sky-600" /> Description</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none text-gray-700">
                <p>{workshop.description}</p>
              </CardContent>
            </Card>

            {workshop.learningOutcomes && workshop.learningOutcomes.length > 0 && (
              <Card className="mb-6 bg-white shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl"><ListChecks className="h-5 w-5 mr-2 text-sky-600" /> What You&apos;ll Learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {workshop.learningOutcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            
            <Card className="mb-6 bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center text-xl"><CalendarDays className="h-5 w-5 mr-2 text-sky-600" /> Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                {renderSchedule()}
                {workshop.startDate && <p className="text-sm text-gray-600 mt-2">Starts on: {new Date(workshop.startDate).toLocaleDateString()}</p>}
                <p className="text-xs text-gray-500 mt-2">Schedule Type: {workshop.scheduleType}</p>
              </CardContent>
            </Card>

            <Card className="mb-6 bg-white shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center text-xl"><BookOpen className="h-5 w-5 mr-2 text-sky-600" /> Session Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {renderCourseDetails()}
              </CardContent>
            </Card>

            {workshop.otherDetails && (
              <Card className="mb-6 bg-white shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl"><Info className="h-5 w-5 mr-2 text-sky-600" /> Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700">
                  <p>{workshop.otherDetails}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */} 
          <div className="lg:w-1/3 space-y-6 lg:mt-0 mt-8">
            <Card className="bg-white shadow-xl sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  {workshop.price === 0 ? 'Enroll for Free!' : `Price: ₹${(workshop.price / 100).toFixed(2)}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  size="lg" 
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white text-lg py-3"
                  onClick={handleEnrollRedirect}
                >
                  {session ? 'Go to Workshop' : 'Login to Enroll'}
                  {!session && <Lock className="h-4 w-4 ml-2"/>}
                </Button>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  {session ? `You are logged in. Click to proceed to your dashboard.` : `You'll be redirected to login/signup.`}
                </p>
              </CardContent>
            </Card>

            {workshop.mentor && (
              <Card className="bg-white shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl"><UserCircle className="h-5 w-5 mr-2 text-sky-600" /> Mentor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-3">
                    {workshop.mentor.user.image && (
                      <img 
                        src={workshop.mentor.user.image} 
                        alt={workshop.mentor.user.name || 'Mentor'}
                        width={64} 
                        height={64} 
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{workshop.mentor.user.name || 'N/A'}</h3>
                      {workshop.mentor.jobTitle && <p className="text-sm text-gray-600">{workshop.mentor.jobTitle}{workshop.mentor.currentCompany && `, ${workshop.mentor.currentCompany}`}</p>}
                    </div>
                  </div>
                  {workshop.mentor.bio && <p className="text-sm text-gray-700 mb-3 line-clamp-3">{workshop.mentor.bio}</p>}
                  {workshop.mentor.skills && workshop.mentor.skills.length > 0 && (
                    <div className="mb-2">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Skills:</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {workshop.mentor.skills.map(skill => (
                          <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* <Link href={`/mentors/${workshop.mentor.user.id}`} passHref>
                    <Button variant="link" className="p-0 h-auto text-sky-600 text-sm">View Mentor Profile <ExternalLink className='h-3 w-3 ml-1'/></Button>
                  </Link> */} 
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicWorkshopDetailPage;
