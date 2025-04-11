// EducationSection.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from "lucide-react";
import { Education } from "./types";

interface EducationSectionProps {
  educationList: Education[];
  setEducationList: React.Dispatch<React.SetStateAction<Education[]>>;
}

const EducationSection: React.FC<EducationSectionProps> = ({
  educationList,
  setEducationList,
}) => {
  // Handle education changes
  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    const newEducationList = [...educationList];
    
    const updatedEducation = {
      ...newEducationList[index],
      [field]: value
    } as Education;
    
    newEducationList[index] = updatedEducation;
    setEducationList(newEducationList);
  };

  // Add new education entry
  const addEducation = () => {
    setEducationList([
      ...educationList,
      {
        institution: "",
        degree: "",
        field: "",
        startYear: "",
        endYear: "",
      },
    ]);
  };

  // Remove education entry
  const removeEducation = (index: number) => {
    const newEducationList = [...educationList];
    newEducationList.splice(index, 1);
    setEducationList(newEducationList);
  };

  return (
    <div className="space-y-4 rounded-md">
      <div className="flex items-center justify-between">
        <div>
        <h3 className="text-lg font-medium">Education History</h3>
        <p className="text-sm text-gray-500">
          Add your educational background to help mentees understand your academic journey
        </p>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={addEducation}
          className="flex items-center"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Education
        </Button>
      </div>

      {educationList.map((edu, index) => (
        <div key={index} className="space-y-4 rounded-md border p-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Education #{index + 1}</h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeEducation(index)}
              className="h-8 w-8 p-0 text-red-500"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`edu-institution-${index}`}>Institution</Label>
            <Input
              id={`edu-institution-${index}`}
              value={edu.institution}
              onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
              placeholder="University or Institution name"
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`edu-degree-${index}`}>Degree</Label>
              <Input
                id={`edu-degree-${index}`}
                value={edu.degree}
                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                placeholder="Bachelor's, Master's, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`edu-field-${index}`}>Field of Study</Label>
              <Input
                id={`edu-field-${index}`}
                value={edu.field}
                onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                placeholder="Computer Science, Business, etc."
              />
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`edu-start-${index}`}>Start Year</Label>
              <Input
                id={`edu-start-${index}`}
                value={edu.startYear}
                onChange={(e) => handleEducationChange(index, 'startYear', e.target.value)}
                placeholder="2010"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`edu-end-${index}`}>End Year</Label>
              <Input
                id={`edu-end-${index}`}
                value={edu.endYear}
                onChange={(e) => handleEducationChange(index, 'endYear', e.target.value)}
                placeholder="2014 (or Present)"
              />
            </div>
          </div>
        </div>
      ))}
      
      {educationList.length === 0 && (
        <p className="text-center text-sm text-gray-500">
          No education records added. Click &quot;Add Education&quot; to add your educational background.
        </p>
      )}
    </div>
  );
};

export default EducationSection;