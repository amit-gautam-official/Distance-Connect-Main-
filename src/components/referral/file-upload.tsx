"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, FileText, Loader2, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FileUploadProps {
  label: string;
  accept?: string;
  value?: string;
  onChange: (url: string) => void;
  description?: string;
  required?: boolean;
}

const FileUpload = ({
  label,
  accept = "application/pdf",
  value,
  onChange,
  description,
  required = false,
}: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check file type
    if (!selectedFile.type.startsWith("application/pdf")) {
      setError("Only PDF files are allowed");
      return;
    }

    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const uploadFile = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);

      // 1. Get a presigned URL from the server
      const presignedRes = await fetch("/api/upload/referral-document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileType: file.type,
        }),
      });

      if (!presignedRes.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { uploadUrl, fileUrl } = await presignedRes.json();

      // 2. Upload the file to the presigned URL
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload file");
      }

      // 3. Update the parent component with the file URL
      onChange(fileUrl);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`file-${label.toLowerCase().replace(/\s+/g, "-")}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      {description && (
        <p className="mb-2 text-sm text-gray-500">{description}</p>
      )}

      <div className="flex items-center gap-2">
        <Input
          id={`file-${label.toLowerCase().replace(/\s+/g, "-")}`}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="max-w-sm"
        />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={uploadFile}
          disabled={!file || isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {value && (
        <div className="mt-2">
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <FileText className="mr-1 h-4 w-4" />
            View Uploaded File
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
