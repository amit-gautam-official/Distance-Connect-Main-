"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import React from "react";

interface ImageUploadProps {
  userId: string;
  isSubmitting: boolean;
  onAvatarUpdate?: (url: string) => void;
  initialAvatarUrl?: string;
}

export const ImageUpload = ({
  userId,
  isSubmitting,
  onAvatarUpdate,
  initialAvatarUrl,
}: ImageUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    initialAvatarUrl || "https://i.sstatic.net/l60Hf.png",
  );
  const [isUploading, setIsUploading] = useState(false);

  // Update preview URL when initialAvatarUrl changes
  React.useEffect(() => {
    if (initialAvatarUrl) {
      setPreviewUrl(initialAvatarUrl);
    }
  }, [initialAvatarUrl]);

  const updateUser = api.user.updateUser.useMutation({
    onSuccess: (data) => {
      // console.log("User updated successfully");
    },
  });

  const uploadImage = api.file.upload.useMutation({
    onSuccess: (data) => {
      updateUser.mutate({
        avatarUrl: data?.url,
      });
      if (data?.url && onAvatarUpdate) {
        onAvatarUpdate(data.url);
      }
      setIsUploading(false);
      toast.success("Image uploaded successfully");
    },
    onError: (error) => {
      setIsUploading(false);
      toast.error("Failed to upload image: " + error.message);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ALLOWED_IMAGE_TYPES = [
      "image/jpeg", 
      "image/png", 
      "image/webp"
    ];

    // Validate file type
    if (!file.type || !ALLOWED_IMAGE_TYPES.includes(file.type)) {
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
        initialAvatarUrl: initialAvatarUrl,
        bucketName: "dc-profile-image",
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
    <div className="flex flex-col  items-center gap-4">
      <div className="relative">
        <Avatar className="h-32 w-32 object-cover">
          <AvatarImage className="object-cover" src={previewUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <label
          htmlFor="image-upload"
          className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90"
        >
          <Camera className="h-4 w-4" />
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
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
}
