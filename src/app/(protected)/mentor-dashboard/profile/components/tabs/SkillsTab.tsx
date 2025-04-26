"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";

interface SkillsTabProps {
  formData: {
    skills: string;
    hiringFields: string;
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

const SkillsTab: React.FC<SkillsTabProps> = ({ formData, handleChange }) => {
  const updateMentorMutation = api.mentor.updateMentor.useMutation();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSkillsUpdate = async () => {
    setIsSubmitting(true);
    try {
      await updateMentorMutation.mutateAsync({
        skills: formData.skills.split(",").map(item => item.trim()),
        hiringFields: formData.hiringFields.split(",").map(item => item.trim()),
      });
      toast.success("Skills updated successfully!");
    } catch (error) {
      console.error("Error updating skills:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


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
            Separate each skill with a comma. For example: &quot;Java, SQL,
            Node.js, Project Management&quot;
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
            Separate each field with a comma. For example: &quot;Software
            Engineering, Data Science, Product Management&quot;
          </p>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button
          type="button"
          className="w-full md:w-auto"
          onClick={handleSkillsUpdate}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </div>
  );
};

export default SkillsTab;
