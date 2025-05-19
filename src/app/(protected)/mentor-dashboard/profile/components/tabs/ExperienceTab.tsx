"use client";
import React from "react";
import { Experience } from "../types";
import ExperienceSection from "../ExperienceSection";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";

interface ExperienceTabProps {
  experienceList: Experience[];
  setExperienceList: React.Dispatch<React.SetStateAction<Experience[]>>;
}

const ExperienceTab: React.FC<ExperienceTabProps> = ({ 
  experienceList, 
  setExperienceList 
}) => {

  

  return (
    <div className="space-y-6">
    

      <ExperienceSection 
        experienceList={experienceList} 
        setExperienceList={setExperienceList}
      />
    
      
    </div>
  );
};

export default ExperienceTab;