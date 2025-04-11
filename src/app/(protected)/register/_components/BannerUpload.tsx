"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Ban, Camera } from "lucide-react";
import { toast } from "sonner";
import React from "react";

interface ImageUploadProps {
  userId: string;
  isSubmitting: boolean;
  initialBannerUrl?: string;
}

export const BannerUpload = ({
  userId,
  isSubmitting,
  initialBannerUrl,
}: ImageUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    initialBannerUrl || "") ;
  const [isUploading, setIsUploading] = useState(false);

  // Update preview URL when initialAvatarUrl changes
  React.useEffect(() => {
    if (initialBannerUrl) {
      setPreviewUrl(initialBannerUrl);
    }
  }, [initialBannerUrl]);

  const updateMentorBanner = api.mentor.updateMentorBanner.useMutation({
    onSuccess: (data) => {
      toast.success("Image uploaded successfully");
    },
  });

  const uploadImage = api.file.upload.useMutation({
    onSuccess: async (data) => {
      updateMentorBanner.mutate({
        profileBanner: data?.url,
      });
      setIsUploading(false);
    },
    onError: (error) => {
      setIsUploading(false);
      toast.error("Failed to upload image: " + error.message);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImageToServer = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Content = base64String.split(",")[1]; // Remove the data URL prefix
      if (!base64Content) return;

      uploadImage.mutate({
        initialAvatarUrl: initialBannerUrl,
        bucketName: "dc-profile-image",
        folderName: "dc-banner-image",
        fileName: userId,
        fileType: selectedFile.type,
        fileContent: base64Content,
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  // Watch for form submission state
  React.useEffect(() => {
    if (isSubmitting && selectedFile) {
      // console.log("uploading image");
      uploadImageToServer();
    }
  }, [isSubmitting]);

  return (
    <div className="flex flex-col w-full  items-center gap-4">
      <div className="relative w-[80%]">
        <div className="w-full overflow-hidden rounded-lg shadow-md">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="aspect-[4/1] h-32 object-cover"
            />
          ) : (
            <div className="flex px-[10%]  h-32 w-full items-center justify-center rounded-lg bg-gray-200">
              <Ban className="h-8 w-8 text-gray-400 pr-2" />
              <p className="text-sm text-gray-500">
                No banner image uploaded.
              </p>
            </div>
          )}
        </div>
        <label
          htmlFor="banner-upload"
          className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90"
        >
          <Camera className="h-4 w-4" />
        </label>
        <input
          id="banner-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          disabled={isUploading || isSubmitting}
        />
      </div>
      {selectedFile && !isSubmitting && (
        <div className="text-sm text-gray-500">
          Image will be uploaded when you submit the form
        </div>
      )}
    </div>
  );
};
