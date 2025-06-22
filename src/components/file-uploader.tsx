"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, FileText, ExternalLink, X, File } from "lucide-react";
import { convertFileToBase64, validateFile } from "@/lib/file-utils";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";

interface FileUploaderProps {
  onFileUploaded: (url: string) => void;
  fileType: "resume" | "coverLetter";
  currentUrl?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUploaded,
  fileType,
  currentUrl,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fileUploadMutation = api.file.upload.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        onFileUploaded(data.url);
        toast({
          title: "File uploaded successfully",
          description: `Your ${fileType === "resume" ? "resume" : "cover letter"} has been uploaded.`,
        });
      }
      setIsUploading(false);
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description:
          error.message || "An error occurred while uploading your file.",
        variant: "destructive",
      });
      setIsUploading(false);
      setSelectedFile(null);
    },
  });

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const allowedTypes = ["application/pdf"];
    const maxSizeMB = 5; // 5MB max size

    if (!validateFile(file, allowedTypes, maxSizeMB)) {
      return;
    }

    setSelectedFile(file);

    try {
      setIsUploading(true);
      // Convert file to base64
      const base64 = await convertFileToBase64(file);

      // Upload to GCP via TRPC
      fileUploadMutation.mutate({
        fileContent: base64,
        fileType: "application/pdf",
        fileName: file.name,
        bucketName: "distance-connect-user-uploads",
        folderName: `referrals/${fileType === "resume" ? "resumes" : "cover-letters"}`,
        initialAvatarUrl: currentUrl,
      });
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error processing file",
        description: "An error occurred while processing your file.",
        variant: "destructive",
      });
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  const handleRemoveFile = () => {
    if (isUploading) return;

    // Clear the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setSelectedFile(null);

    // Use the file.ts API to remove the file from GCP if it exists
    if (currentUrl) {
      fileUploadMutation.mutate({
        fileContent: "delete",
        fileType: "delete",
        fileName: "delete",
        bucketName: "distance-connect-user-uploads",
        initialAvatarUrl: currentUrl,
      });
    }

    // Update parent component
    onFileUploaded("");
  };

  return (
    <div className="flex flex-col space-y-2">
      <input
        type="file"
        accept=".pdf"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <div className="flex items-center">
        {/* Show file preview if a file is selected or already uploaded */}
        {(selectedFile || currentUrl) && (
          <div className="mr-2 flex items-center rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
            <File className="mr-2 h-4 w-4 text-blue-500" />
            <span className="max-w-[150px] truncate">
              {selectedFile
                ? selectedFile.name
                : currentUrl
                  ? `${fileType === "resume" ? "Resume" : "Cover Letter"}`
                  : ""}
            </span>

            {/* View button */}
            {currentUrl && (
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-500 hover:text-blue-700"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}

            {/* Remove button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="ml-1 h-6 w-6 rounded-full p-0 text-gray-400 hover:bg-gray-200 hover:text-red-500"
              onClick={handleRemoveFile}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Upload button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleUploadClick}
          disabled={isUploading}
          className="text-sm"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {currentUrl ? "Replace File" : "Upload File"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FileUploader;
