"use client";
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Paperclip, Plus, Trash } from "lucide-react";
import { Experience } from "./types";
import { toast } from "sonner";
import { api } from "@/trpc/react";

interface ExperienceSectionProps {
  experienceList: Experience[];
  setExperienceList: React.Dispatch<React.SetStateAction<Experience[]>>;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experienceList,
  setExperienceList,
}) => {
  const documentInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [fileDataList, setFileDataList] = React.useState<
    Record<
      number,
      {
        filePreview: string;
        fileName: string;
        fileType: string;
        fileDisplayUrl: string;
        fileTypeBackend: string;
        initialUrl?: string;
      }
    >
  >({});

  const updateMentorMutation = api.mentor.updateMentor.useMutation();
  const fileUploadMutation = api.file.upload.useMutation();

  useEffect(() => {
    if (experienceList.length > 0) {
      const updatedFileDataList = { ...fileDataList };
      experienceList.forEach((exp, index) => {
        if (exp.proofUrl && !updatedFileDataList[index]) {
          updatedFileDataList[index] = {
            filePreview: exp.proofUrl,
            fileName: exp.proofUrl.split("/").pop() || "",
            fileType: exp?.proofUrl?.split('.')?.pop()?.split('?')[0] === "pdf" ? "document" : "image",
            fileDisplayUrl: exp.proofUrl,
            fileTypeBackend: "",
            initialUrl: exp.proofUrl,
          };
        }
      });
      setFileDataList(updatedFileDataList);
    }
  }, [experienceList]);
  
  const handleUploadExperience = async () => {
    setIsUploading(true);

    try {
      const updatedExperienceList = [...experienceList];

      for (const index in fileDataList) {

        const fileData = fileDataList[index];
        if (fileData && fileData.filePreview) {
          const uploadResult = await fileUploadMutation.mutateAsync({
            initialAvatarUrl: fileData.initialUrl,
            fileName: fileData.fileName,
            fileType: fileData.fileTypeBackend,
            fileContent: fileData.filePreview,
            bucketName: "dc-public-files",
            folderName: "experience-proof-pdf-images",
          });

          if (uploadResult.success) {
            
            const idx = parseInt(index);
            if (updatedExperienceList[idx]) {
              updatedExperienceList[idx].proofUrl = uploadResult.url;
            }
          } else {
            toast.error(
              `Failed to upload proof for Experience #${parseInt(index) + 1}`,
            );
            return;
          }
        }
      }

      // Save all experiences after uploading
      await updateMentorMutation.mutateAsync({
        wholeExperience: updatedExperienceList,
      });

      toast.success("Experiences saved successfully!");
      // setFileDataList({});
    } catch (error) {
      console.error(error);
      toast.error("Error saving experiences. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle experience changes
  const handleExperienceChange = (
    index: number,
    field: keyof Experience,
    value: string | boolean,
  ) => {
    const newExperienceList = [...experienceList];

    const updatedExperience = {
      ...newExperienceList[index],
      [field]: value,
      // If current is set to true, clear the end date
      ...(field === "current" && value === true ? { endDate: "" } : {}),
    } as Experience;

    newExperienceList[index] = updatedExperience;
    setExperienceList(newExperienceList);
  };

  const handleFileSelect = (index: number, file: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }

    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      toast.error("Invalid file type. Only images and PDFs are allowed.");
      return;
    }

    const reader = new FileReader();
    const objectURL = URL.createObjectURL(file);

    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Content = base64String.split(",")[1];

      setFileDataList((prev) => ({
        ...prev,
        [index]: {
          filePreview: base64Content ?? "",
          fileName: file.name,
          fileType: file.type.startsWith("image/") ? "image" : "document",
          fileDisplayUrl: objectURL,
          fileTypeBackend: file.type,
          initialUrl: fileDataList[index]?.initialUrl || "", // Keep the initial URL if it exists
        },
      }));
    };

    reader.readAsDataURL(file);
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
        proofUrl: "", // proof of experience image url
        verified: false,
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
            Share your work history to showcase your professional journey and
            expertise
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
              onChange={(e) =>
                handleExperienceChange(index, "company", e.target.value)
              }
              placeholder="Company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`exp-position-${index}`}>Position</Label>
            <Input
              id={`exp-position-${index}`}
              value={exp.position}
              onChange={(e) =>
                handleExperienceChange(index, "position", e.target.value)
              }
              placeholder="Your job title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`exp-description-${index}`}>Description</Label>
            <Textarea
              id={`exp-description-${index}`}
              value={exp.description}
              onChange={(e) =>
                handleExperienceChange(index, "description", e.target.value)
              }
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
                onChange={(e) =>
                  handleExperienceChange(index, "startDate", e.target.value)
                }
                placeholder="2020-01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`exp-end-${index}`}>End Date</Label>
              <Input
                id={`exp-end-${index}`}
                type="month"
                value={exp.endDate}
                onChange={(e) =>
                  handleExperienceChange(index, "endDate", e.target.value)
                }
                placeholder="2023-01"
                disabled={exp.current}
              />
            </div>
            <div className="flex flex-col items-center justify-start space-y-2">
              {fileDataList[index]?.filePreview &&
                fileDataList[index]?.fileType === "image" && (
                  <img
                    src={fileDataList[index].fileDisplayUrl}
                    alt="File Preview"
                    className="h-32 w-auto object-cover"
                  />
                )}

              {fileDataList[index]?.fileType === "document" &&
                fileDataList[index]?.filePreview && (
                  <div className="flex h-24 w-48 items-center justify-center rounded border bg-gray-100">
                    <a
                      href={fileDataList[index].fileDisplayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-2xl"
                    >
                      📄{" "}
                      <span className="text-xs">
                        {fileDataList[index].fileName}
                      </span>
                    </a>
                  </div>
                )}

              <div className="flex items-center justify-start gap-x-2 space-y-2">
                <button
                  type="button"
                  onClick={() => documentInputRef.current?.click()}
                  className="text-gray-500 hover:text-blue-500"
                >
                  <Paperclip size={20} />
                </button>
                <Label htmlFor={`exp-proof-${index}`}>
                  Experience Verification Documents
                </Label>
                <input
                  type="file"
                  ref={documentInputRef}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(index, file); // Pass index
                    e.target.value = "";
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`exp-current-${index}`}
              checked={exp.current}
              onChange={(e) =>
                handleExperienceChange(index, "current", e.target.checked)
              }
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
          No experience records added. Click &quot;Add Experience&quot; to add
          your work history.
        </p>
      )}
      <div className="flex justify-end">
        <Button
          type="button"
          className="btn btn-primary"
          onClick={handleUploadExperience}
          disabled={isUploading || experienceList.length === 0}
        >
          {isUploading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        "Save Experience"
      )}
        </Button>
      </div>
    </div>
  );
};

export default ExperienceSection;
