// ExperienceSection.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";
import { Experience } from "./types";

interface ExperienceSectionProps {
  experienceList: Experience[];
  setExperienceList: React.Dispatch<React.SetStateAction<Experience[]>>;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experienceList,
  setExperienceList,
}) => {
  // Handle experience changes
  const handleExperienceChange = (
    index: number,
    field: keyof Experience,
    value: string | boolean
  ) => {
    const newExperienceList = [...experienceList];
    
    const updatedExperience = {
      ...newExperienceList[index],
      [field]: value,
      // If current is set to true, clear the end date
      ...(field === 'current' && value === true ? { endDate: '' } : {})
    } as Experience;
    
    newExperienceList[index] = updatedExperience;
    setExperienceList(newExperienceList);
  };

  // Add new experience entry
  const addExperience = () => {
    setExperienceList([
      ...experienceList,
      {
        company: "",
        position: "",
        description: "",
        startDate: "",
        endDate: "",
        current: false,
      },
    ]);
  };

  // Remove experience entry
  const removeExperience = (index: number) => {
    const newExperienceList = [...experienceList];
    newExperienceList.splice(index, 1);
    setExperienceList(newExperienceList);
  };

  return (
    <div className="space-y-4 rounded-md">
      <div className="flex items-center justify-between">
          <div>
                <h3 className="text-lg font-medium">Professional Experience</h3>
                <p className="text-sm text-gray-500">
                  Share your work history to showcase your professional journey and expertise
                </p>
              </div>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addExperience}
          className="flex items-center"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Experience
        </Button>
      </div>

      {experienceList.map((exp, index) => (
        <div key={index} className="space-y-4 rounded-md border p-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Experience #{index + 1}</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeExperience(index)}
              className="h-8 w-8 p-0 text-red-500"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`exp-company-${index}`}>Company</Label>
            <Input
              id={`exp-company-${index}`}
              value={exp.company}
              onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
              placeholder="Company name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`exp-position-${index}`}>Position</Label>
            <Input
              id={`exp-position-${index}`}
              value={exp.position}
              onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
              placeholder="Your job title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`exp-description-${index}`}>Description</Label>
            <Textarea
              id={`exp-description-${index}`}
              value={exp.description}
              onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
              placeholder="Describe your responsibilities and achievements"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`exp-start-${index}`}>Start Date</Label>
              <Input
                id={`exp-start-${index}`}
                type="month"
                value={exp.startDate}
                onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                placeholder="2020-01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`exp-end-${index}`}>End Date</Label>
              <Input
                id={`exp-end-${index}`}
                type="month"
                value={exp.endDate}
                onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                placeholder="2023-01"
                disabled={exp.current}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`exp-current-${index}`}
              checked={exp.current}
              onChange={(e) => handleExperienceChange(index, 'current', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor={`exp-current-${index}`} className="text-sm">
              I currently work here
            </Label>
          </div>
        </div>
      ))}
      
      {experienceList.length === 0 && (
        <p className="text-center text-sm text-gray-500">
          No experience records added. Click &quot;Add Experience&quot; to add your work history.
        </p>
      )}
    </div>
  );
};

export default ExperienceSection;