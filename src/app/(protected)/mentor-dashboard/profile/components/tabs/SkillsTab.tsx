// tabs/SkillsTab.tsx
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SkillsTabProps {
  formData: {
    skills: string;
    hiringFields: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const SkillsTab: React.FC<SkillsTabProps> = ({ formData, handleChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Skills & Expertise</h3>
        <p className="text-sm text-gray-500">
          Highlight your professional skills and areas of expertise
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="skills">Professional Skills</Label>
          <Textarea
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="List your current set of skills (comma separated)"
            className="min-h-[120px]"
          />
          <p className="text-xs text-gray-500">
            Separate each skill with a comma. For example: &quot;Java, SQL, Node.js, Project Management&quot;
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hiringFields">Hiring Fields</Label>
          <Textarea
            id="hiringFields"
            name="hiringFields"
            value={formData.hiringFields}
            onChange={handleChange}
            placeholder="List fields you are hiring for (comma separated)"
            className="min-h-[120px]"
          />
          <p className="text-xs text-gray-500">
            Separate each field with a comma. For example: &quot;Software Engineering, Data Science, Product Management&quot;
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkillsTab;