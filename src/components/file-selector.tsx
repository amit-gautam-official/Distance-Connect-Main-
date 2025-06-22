"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, File, X, ExternalLink } from "lucide-react";
import { validateFile } from "@/lib/file-utils";
import { useToast } from "@/components/ui/use-toast";

interface FileSelectorProps {
  onFileSelected: (file: File | null) => void;
  fileType: "resume" | "coverLetter";
  currentUrl?: string;
  required?: boolean;
}

const FileSelector: React.FC<FileSelectorProps> = ({
  onFileSelected,
  fileType,
  currentUrl,
  required = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const allowedTypes = ["application/pdf"];
    const maxSizeMB = 5; // 5MB max size

    if (!validateFile(file, allowedTypes, maxSizeMB)) {
      return;
    }

    setSelectedFile(file);
    onFileSelected(file);
  };

  const handleRemoveFile = () => {
    // Clear the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setSelectedFile(null);
    onFileSelected(null);
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

            {/* View button for previously uploaded files */}
            {currentUrl && !selectedFile && (
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
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Select file button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleSelectClick}
          className="text-sm"
        >
          <Upload className="mr-2 h-4 w-4" />
          {currentUrl || selectedFile ? "Replace File" : "Select File"}
        </Button>
      </div>
    </div>
  );
};

export default FileSelector;
