"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockMentors, mockStudents } from "./data/mock-data";
import StudentManagement from "./components/student-management";
import MentorManagement from "./components/mentor-management";
import MeetingLogsContent from "./components/MeetingLogsContent";
import StudentViewModal from "./components/modals/student-view-modal";
import MentorViewModal from "./components/modals/mentor-view-modal";
import VerifyMentorModal from "./components/modals/verify-mentor-modal";
import { api } from "@/trpc/react";
import type { JsonValue } from "@prisma/client/runtime/library";
import { WorkshopLogsContent } from "./components/WorkshopLogsContent";


interface Mentor  {
    user: {
        id: string;
        username: string | null;
        email: string;
        image: string | null;
    };
    userId: string;
    industry: string | null;
    linkedinUrl: string | null;
    currentCompany: string | null;
    mentorName: string | null;
    verified: boolean;
    wholeExperience: JsonValue[];
    companyEmailVerified: boolean;
    companyEmail: string | null;
    mentorTier: string | null;
    mentorSessionPriceRange: string | null;
    tierReasoning: string | null;
}




export default function AdminDashboard() {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);


    







  const handleVerify = (mentor : Mentor) => {
    setSelectedMentor(mentor);
    setIsVerifyModalOpen(true);

  
  };
 

  return (
    <div className="container mx-auto md:w-[80%] px-4 py-6 md:py-8">
      <h1 className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-center text-3xl font-bold text-transparent md:mb-8 md:text-4xl">
        Admin Dashboard
      </h1>
      

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="mx-auto mb-6 grid w-full max-w-md grid-cols-4 rounded-lg md:mb-8">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="mentors">Mentors</TabsTrigger>
          <TabsTrigger value="meeting-logs">Meeting Logs</TabsTrigger>
          <TabsTrigger value="workshop-logs">Workshop Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4 md:space-y-6">
          <StudentManagement
          />
        </TabsContent>

        <TabsContent value="mentors" className="space-y-4 md:space-y-6">
          <MentorManagement
            handleVerify={handleVerify}
          />
        </TabsContent>

        <TabsContent value="meeting-logs" className="space-y-4 md:space-y-6">
          <MeetingLogsContent />
        </TabsContent>
        <TabsContent value="workshop-logs" className="space-y-4 md:space-y-6">
          <WorkshopLogsContent />
        </TabsContent>
      </Tabs>

    

 

      <VerifyMentorModal

        mentor={selectedMentor}
        isOpen={isVerifyModalOpen}
        setIsOpen={setIsVerifyModalOpen}
      />
    </div>
  );
}
