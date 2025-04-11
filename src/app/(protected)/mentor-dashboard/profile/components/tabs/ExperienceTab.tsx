// tabs/ExperienceTab.tsx
import React from "react";
import { Experience } from "../types";
import ExperienceSection from "../ExperienceSection";

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