import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { Education } from "./Education";
import { Certifications } from "./Certifications";
import { Skills } from "./Skills";
import { Tools } from "./Tools";
import { Offerings } from "./Offerings";
import { Reviews } from "./Reviews";

interface Experience {
  title: string;
  company: string;
  period: string;
  duration: string;
}

interface SkillGroup {
  category: string;
  skills: string[];
}

interface Offering {
  id: string;
  title: string;
  description: string;
  rating: number;
  duration: string;
  price: string;
  type: string;
  repliesIn: string;
  priority: number;
  mentorUserId: string;
  userEmail: string;
}

interface Review {
  id: number;
  name: string;
  avatar: string;
  role: string;
  rating: number;
  date: string;
  content: string;
}

interface EducationItem {
  degree: string;
  institution: string;
  year: string;
}

interface ProfileTabsProps {
  experiences: Experience[];
  education: EducationItem[];
  certifications: string[];
  skillGroups: SkillGroup[];
  tools: string[];
  offerings: Offering[];
  reviews: Review[];
}

export function ProfileTabs({
  experiences,
  education,
  certifications,
  skillGroups,
  tools,
  offerings,
  reviews,
}: ProfileTabsProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="flex w-full border-b bg-transparent p-0">
          <TabsTrigger
            value="profile"
            className="flex-1 rounded-none px-1 py-3 font-medium data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="offerings"
            className="flex-1 rounded-none px-1 py-3 font-medium data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
          >
            Offerings
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="flex-1 rounded-none px-1 py-3 font-medium data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
          >
            Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-8 p-6">
          {/* Professional Experience */}
          <ExperienceTimeline experiences={experiences} />
          
          {/* Education */}
          <Education education={education} />
          
          {/* Certifications */}
          <Certifications certifications={certifications} />
          
          {/* Skills */}
          <Skills skillGroups={skillGroups} />
          
          {/* Tools */}
          <Tools tools={tools} />
        </TabsContent>

        <TabsContent value="offerings" className="p-6">
          <Offerings offerings={offerings} />
        </TabsContent>

        <TabsContent value="reviews" className="p-6">
          <Reviews reviews={reviews} />
        </TabsContent>
      </Tabs>
    </div>
  );
} 