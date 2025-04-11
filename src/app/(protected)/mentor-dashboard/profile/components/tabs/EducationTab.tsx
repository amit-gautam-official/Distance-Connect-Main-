// tabs/EducationTab.tsx
import React from "react";
import { Education } from "../types";
import EducationSection from "../EducationSection";

interface EducationTabProps {
  educationList: Education[];
  setEducationList: React.Dispatch<React.SetStateAction<Education[]>>;
}

const EducationTab: React.FC<EducationTabProps> = ({ 
  educationList, 
  setEducationList 
}) => {
  return (
    <div className="space-y-6">
    

      <EducationSection 
        educationList={educationList} 
        setEducationList={setEducationList}
      />
    </div>
  );
};

export default EducationTab;