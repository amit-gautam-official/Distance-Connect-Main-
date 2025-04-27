"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockMentors, mockStudents } from "./data/mock-data";
import StudentManagement from "./components/student-management";
import MentorManagement from "./components/mentor-management";
import StudentViewModal from "./components/modals/student-view-modal";
import MentorViewModal from "./components/modals/mentor-view-modal";
import VerifyMentorModal from "./components/modals/verify-mentor-modal";
import { api } from "@/trpc/react";
import type { JsonValue } from "@prisma/client/runtime/library";


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
}




export default function AdminDashboard() {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isMentorViewModalOpen, setIsMentorViewModalOpen] = useState(false);
  const [isStudentViewModalOpen, setIsStudentViewModalOpen] = useState(false);
  const {data : mentors , isLoading : mentorLoading}  = api.mentor.getMentorsForAdmin.useQuery(
    undefined, {
     enabled: true, 
    }
  );
    const {data : students , isLoading : studentLoading} = api.admin.getStudentsForAdmin.useQuery();

    
    if(mentorLoading || studentLoading) {
        return <div>Loading...</div>;
    }
    
    console.log(students);







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
        <TabsList className="mx-auto mb-6 grid w-full max-w-md grid-cols-2 rounded-lg md:mb-8">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="mentors">Mentors</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4 md:space-y-6">
          <StudentManagement
            students={students ?? []}
          />
        </TabsContent>

        <TabsContent value="mentors" className="space-y-4 md:space-y-6">
          <MentorManagement
            
            mentors={mentors ?? []}
            handleVerify={handleVerify}
          />
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
