"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, Camera, Video as VideoIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface RecurringScheduleItem {
  day: string;
  time: string;
}

interface CustomScheduleItem {
  date: string; // Expected format: yyyy-MM-dd
  time: string;
}

type Workshop = {
  id: string;
  name: string;
  description: string;
  numberOfDays: number;
  scheduleType: "recurring" | "custom";
  startDate?: string | null;
  schedule: any[];
  price: number;
  learningOutcomes: string[];
  courseDetails: Record<
    string,
    { description: string; isFreeSession: boolean }
  >;
  otherDetails: string | null;
  bannerImage: string | null;
  introductoryVideoUrl?: string | null;
  mentorGmailId: string;
};

interface EditWorkshopModalProps {
  workshop: Workshop;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditWorkshopModal({
  workshop,
  isOpen,
  onClose,
  onSuccess,
}: EditWorkshopModalProps) {
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [currentIntroVideoUrl, setCurrentIntroVideoUrl] = useState<
    string | null
  >(null);
  const [newIntroVideoFile, setNewIntroVideoFile] = useState<File | null>(null);
  const [newIntroVideoPreview, setNewIntroVideoPreview] = useState<string>("");
  const introVideoInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingNewVideo, setIsUploadingNewVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);

  const [form, setForm] = useState({
    name: "",
    description: "",
    numberOfDays: "",
    price: "",
    learningOutcomes: [""],
    otherDetails: "",
    scheduleType: "recurring" as "recurring" | "custom",
    startDate: "",
    mentorGmailId: "",
  });

  const [recurringSchedule, setRecurringSchedule] = useState<
    RecurringScheduleItem[]
  >([{ day: "Monday", time: "10:00 AM" }]);
  const [customSchedule, setCustomSchedule] = useState<CustomScheduleItem[]>([
    { date: new Date().toISOString().split("T")[0] || "", time: "10:00 AM" },
  ]);

  const [courseDetails, setCourseDetails] = useState<
    Record<string, { description: string; isFreeSession: boolean }>
  >({});

  // Effect to synchronize custom schedule length with number of days
  useEffect(() => {
    if (form.scheduleType === "custom") {
      const numDays = parseInt(form.numberOfDays, 10) || 0; // Ensure numDays is a number here
      setCustomSchedule((currentCustomSchedule) => {
        const currentLength = currentCustomSchedule.length;
        if (currentLength < numDays) {
          const newItems = Array(numDays - currentLength)
            .fill(null)
            .map(() => ({
              date: new Date().toISOString().split("T")[0] || "",
              time: "10:00 AM",
            }));
          return [...currentCustomSchedule, ...newItems];
        } else if (currentLength > numDays) {
          return currentCustomSchedule.slice(0, numDays);
        }
        return currentCustomSchedule; // No change needed if lengths match
      });
    }
    // When switching away from custom, customSchedule is reset by handleInputChange
  }, [form.numberOfDays, form.scheduleType, setCustomSchedule]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) =>
        reject(new Error("File reading failed: " + error));
    });
  };

  useEffect(() => {
    if (workshop) {
      setBannerPreview(workshop.bannerImage || "");
      setCurrentIntroVideoUrl(workshop.introductoryVideoUrl || null);
      setNewIntroVideoFile(null);
      setNewIntroVideoPreview("");

      setForm({
        name: workshop.name,
        description: workshop.description,
        numberOfDays: workshop.numberOfDays.toString(),
        price: (workshop.price / 100).toString(),
        learningOutcomes:
          workshop.learningOutcomes.length > 0
            ? workshop.learningOutcomes
            : [""],
        otherDetails: workshop.otherDetails || "",
        scheduleType: workshop.scheduleType || "recurring",
        startDate: workshop.startDate
          ? new Date(workshop.startDate).toISOString().split("T")[0] || ""
          : "",
        mentorGmailId: workshop.mentorGmailId || "",
      });

      if (
        workshop.scheduleType === "custom" &&
        Array.isArray(workshop.schedule)
      ) {
        setCustomSchedule(
          workshop.schedule.map((s: Partial<CustomScheduleItem>) => ({
            date: s.date
              ? s.date.includes("T")
                ? s.date.split("T")[0] || ""
                : s.date
              : new Date().toISOString().split("T")[0] || "",
            time: s.time || "10:00 AM",
          })),
        );
      } else if (
        workshop.scheduleType === "recurring" &&
        Array.isArray(workshop.schedule)
      ) {
        setRecurringSchedule(
          workshop.schedule.map((s: Partial<RecurringScheduleItem>) => ({
            day: s.day || "Monday",
            time: s.time || "10:00 AM",
          })),
        );
      }

      const newCourseDetailsState: Record<
        string,
        { description: string; isFreeSession: boolean }
      > = {};
      const numDaysToIterate = workshop.numberOfDays;

      for (let i = 1; i <= numDaysToIterate; i++) {
        const dayKey = `Day ${i}`;
        const existingDetail = workshop.courseDetails?.[dayKey];

        if (
          existingDetail &&
          typeof existingDetail === "object" &&
          "description" in existingDetail
        ) {
          newCourseDetailsState[dayKey] = {
            description: String(existingDetail.description),
            isFreeSession: !!existingDetail.isFreeSession,
          };
        } else if (typeof existingDetail === "string") {
          newCourseDetailsState[dayKey] = {
            description: existingDetail,
            isFreeSession: false,
          };
        } else {
          newCourseDetailsState[dayKey] = {
            description: "",
            isFreeSession: false,
          };
        }
      }
      for (let i = 1; i <= workshop.numberOfDays; i++) {
        const dayKey = `Day ${i}`;
        if (!newCourseDetailsState[dayKey]) {
          newCourseDetailsState[dayKey] = {
            description: "",
            isFreeSession: false,
          };
        }
      }
      setCourseDetails(newCourseDetailsState);
    }
  }, [workshop]);

  const uploadWorkshopVideo = api.workshop.uploadWorkshopIntroVideo.useMutation(
    {
      onSuccess: (data) => {
        toast.success("Introductory video updated successfully!");
        setCurrentIntroVideoUrl(data.introductoryVideoUrl || null);
        setNewIntroVideoFile(null);
        setNewIntroVideoPreview("");
      },
      onError: (error) => {
        toast.error("Failed to update video: " + error.message);
      },
      onSettled: () => {
        setIsUploadingNewVideo(false);
      },
    },
  );

  const uploadImage = api.file.upload.useMutation();

  const updateWorkshop = api.workshop.updateWorkshop.useMutation({
    onSuccess: () => {
      if (!isUploadingNewVideo) {
        toast.success("Workshop updated successfully!");
      }
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update workshop.");
    },
    onSettled: () => {
      setIsUploading(false);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "numberOfDays") {
      const days = parseInt(value, 10);
      if (!isNaN(days) && days >= 1) {
        setForm((prev) => ({ ...prev, [name]: value }));
        // Adjust courseDetails based on new number of days
        const newCourseDetails: Record<
          string,
          { description: string; isFreeSession: boolean }
        > = {};
        for (let i = 1; i <= days; i++) {
          newCourseDetails[`Day ${i}`] = courseDetails[`Day ${i}`] || {
            description: "",
            isFreeSession: false,
          };
        }
        setCourseDetails(newCourseDetails);
      } else if (value === "") {
        setForm((prev) => ({ ...prev, [name]: "" })); // Or handle empty string as you see fit, maybe set to 1
        const newCourseDetails: Record<
          string,
          { description: string; isFreeSession: boolean }
        > = {};
        newCourseDetails["Day 1"] = courseDetails["Day 1"] || {
          description: "",
          isFreeSession: false,
        };
        setCourseDetails(newCourseDetails);
      }
    } else if (name === "price") {
      const price = parseFloat(value);
      if (!isNaN(price) && price >= 0) {
        setForm((prev) => ({ ...prev, [name]: value }));
      } else if (value === "") {
        setForm((prev) => ({ ...prev, [name]: "" }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "scheduleType") {
      // Reset schedules when type changes to avoid sending incorrect data
      if (value === "recurring") {
        setCustomSchedule([
          {
            date: new Date().toISOString().split("T")[0] || "",
            time: "10:00 AM",
          },
        ]);
      } else {
        setRecurringSchedule([{ day: "Monday", time: "10:00 AM" }]);
      }
    }
  };

  const handleRecurringScheduleChange = (
    index: number,
    field: keyof RecurringScheduleItem,
    value: string,
  ) => {
    const updated = [...recurringSchedule];
    updated[index] = { ...updated[index], [field]: value } as any;
    setRecurringSchedule(updated);
  };
  const addRecurringScheduleItem = () =>
    setRecurringSchedule([
      ...recurringSchedule,
      { day: "Monday", time: "10:00 AM" },
    ]);
  const removeRecurringScheduleItem = (index: number) =>
    setRecurringSchedule(recurringSchedule.filter((_, i) => i !== index));

  const handleCustomScheduleChange = (
    index: number,
    field: keyof CustomScheduleItem,
    value: string,
  ) => {
    const updated = [...customSchedule];
    updated[index] = { ...updated[index], [field]: value } as any;
    setCustomSchedule(updated);
  };
  const addCustomScheduleItem = () =>
    setCustomSchedule([
      ...customSchedule,
      { date: new Date().toISOString().split("T")[0] || "", time: "10:00 AM" },
    ]);
  const removeCustomScheduleItem = (index: number) =>
    setCustomSchedule(customSchedule.filter((_, i) => i !== index));

  const handleCourseDetailChange = (
    day: string,
    field: "description" | "isFreeSession",
    value: string | boolean,
  ) => {
    setCourseDetails((prev) => ({
      ...prev,
      [day]: {
        ...(prev[day] || { description: "", isFreeSession: false }), // Ensure prev[day] exists
        [field]: value,
      },
    }));
  };

  const handleLearningOutcomeChange = (index: number, value: string) => {
    const updated = [...form.learningOutcomes];
    updated[index] = value;
    setForm((prev) => ({ ...prev, learningOutcomes: updated }));
  };
  const addLearningOutcome = () =>
    setForm((prev) => ({
      ...prev,
      learningOutcomes: [...prev.learningOutcomes, ""],
    }));
  const removeLearningOutcome = (index: number) => {
    if (form.learningOutcomes.length > 1) {
      setForm((prev) => ({
        ...prev,
        learningOutcomes: prev.learningOutcomes.filter((_, i) => i !== index),
      }));
    }
  };

  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size should be less than 50MB");
      return;
    }

    setBannerImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleNewIntroVideoSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "video/mp4",
        "video/webm",
        "video/quicktime",
        "video/x-msvideo",
      ];
      const maxSize = 50 * 1024 * 1024; // 500MB for direct upload

      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid video type. Allowed: MP4, WebM, MOV.`);
        if (introVideoInputRef.current) introVideoInputRef.current.value = "";
        setNewIntroVideoFile(null);
        setNewIntroVideoPreview("");
        return;
      }
      if (file.size > maxSize) {
        toast.error("Video file is too large (max 500MB).");
        if (introVideoInputRef.current) introVideoInputRef.current.value = "";
        setNewIntroVideoFile(null);
        setNewIntroVideoPreview("");
        return;
      }
      setNewIntroVideoFile(file);
      setNewIntroVideoPreview(URL.createObjectURL(file));
    } else {
      setNewIntroVideoFile(null);
      setNewIntroVideoPreview("");
    }
  };

  const signedUrlResultMutation = api.file.getSignedUploadUrl.useMutation();
  const updateWorkshopVideoUrlMutation =
    api.workshop.updateWorkshopVideoUrl.useMutation();
  // Function to upload video directly to bucket using signed URL
  const directVideoUpload = async (): Promise<string | null> => {
    if (!newIntroVideoFile) return null;

    setIsUploadingNewVideo(true);
    setVideoUploadProgress(0);

    try {
      // Step 1: Get a signed URL for direct upload
      const signedUrlResult = await signedUrlResultMutation.mutateAsync({
        bucketName: "dc-public-files",
        folderName: "dc-ws-intro-video",
        fileName: newIntroVideoFile.name,
        fileType: newIntroVideoFile.type,
        initialVideoUrl: workshop.introductoryVideoUrl || undefined,
      });

      console.log(signedUrlResult);

      if (!signedUrlResult.success || !signedUrlResult.signedUrl) {
        throw new Error("Failed to get signed upload URL");
      }

      //Step 2: upload the file
      const response = await fetch(signedUrlResult.signedUrl, {
        method: 'PUT',
        body: newIntroVideoFile,
        headers: {
            'Content-Type': newIntroVideoFile.type,
            'x-goog-content-length-range': '0,52428800', // use your actual allowed range here
        }
    });

    if (response.ok) {
        console.log('Video uploaded successfully!');
    } else {
        console.error('Error uploading video:', response);
    }

    
      // Step 3: Update the workshop with the public URL
      await updateWorkshopVideoUrlMutation.mutateAsync({
        workshopId: workshop.id,
        videoUrl: signedUrlResult.publicUrl,
      });

      return signedUrlResult.publicUrl
    }catch(error: any) {
      console.error("Direct video upload failed:", error);
      toast.error(`Video upload failed: ${error.message || "Unknown error"}`);
      return null;
    } finally {
      setIsUploadingNewVideo(false);
      setVideoUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedNumberOfDays = parseInt(form.numberOfDays, 10);
    if (isNaN(parsedNumberOfDays) || parsedNumberOfDays < 1) {
      toast.error("Number of days must be a positive integer.");
      return;
    }

    const parsedPrice = parseFloat(form.price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      toast.error("Price must be a non-negative number.");
      return;
    }

    if (!form.mentorGmailId || !form.mentorGmailId.endsWith("@gmail.com")) {
      toast.error(
        "Mentor Gmail ID is required and must be a @gmail.com address.",
      );
      return;
    }
    if (
      form.scheduleType === "recurring" &&
      recurringSchedule.some((item) => !item.day || !item.time)
    ) {
      toast.error("All recurring schedule entries must have a day and time.");
      return;
    }
    if (
      form.scheduleType === "custom" &&
      customSchedule.some((item) => !item.date || !item.time)
    ) {
      toast.error("All custom schedule entries must have a date and time.");
      return;
    }
    if (
      form.scheduleType === "custom" &&
      !form.startDate &&
      customSchedule.length > 0
    ) {
      // toast.error("A start date is recommended for custom schedules if sessions are defined.");
    }

    const learningOutcomesFiltered = form.learningOutcomes.filter(
      (outcome) => outcome.trim() !== "",
    );
    if (learningOutcomesFiltered.length === 0) {
      toast.error("At least one learning outcome is required.");
      return;
    }

    let finalBannerUrl = workshop.bannerImage;

    if (bannerImage) {
      try {
        const bannerBase64 = await fileToBase64(bannerImage);
        if (!bannerBase64) {
          throw new Error("Failed to convert banner image to base64.");
        }
        const uploadResult = await uploadImage.mutateAsync({
          bucketName: "dc-public-files",
          folderName: "dc-ws-banner",
          fileName: bannerImage.name,
          fileType: bannerImage.type,
          fileContent: bannerBase64.split(",")[1] || "",
          initialAvatarUrl: workshop.bannerImage || undefined,
        });
        if (uploadResult.success && uploadResult.url) {
          finalBannerUrl = uploadResult.url;
        } else {
          throw new Error("Banner upload failed to return a URL.");
        }
      } catch (error: any) {
        toast.error("Failed to upload new banner: " + error.message);
        return;
      }
    }

    // Handle intro video upload using direct upload method
    if (newIntroVideoFile) {
      try {
        // Use our direct upload method instead of base64 conversion
        const videoUploadResult = await directVideoUpload();
        if (!videoUploadResult) {
          toast.error(
            "Video upload failed. You can try again later by editing the workshop.",
          );
        } else {
          // Set the current video URL to the newly uploaded one for UI update
          setCurrentIntroVideoUrl(videoUploadResult);
          // Clear the file input state
          setNewIntroVideoFile(null);
          setNewIntroVideoPreview("");
          if (introVideoInputRef.current) introVideoInputRef.current.value = "";
        }
      } catch (error: any) {
        console.error("Error in video upload:", error);
        toast.error("Failed to update video: " + error.message);
      }
    }

    const mutationData = {
      id: workshop.id,
      name: form.name,
      description: form.description,
      numberOfDays: parsedNumberOfDays,
      price: parsedPrice * 100,
      learningOutcomes: learningOutcomesFiltered,
      courseDetails,
      otherDetails: form.otherDetails,
      scheduleType: form.scheduleType,
      startDate: form.startDate || undefined,
      schedule:
        form.scheduleType === "recurring" ? recurringSchedule : customSchedule,
      mentorGmailId: form.mentorGmailId,
      bannerImage: finalBannerUrl || "",
    };

    try {
      await updateWorkshop.mutateAsync(mutationData);
    } catch (error: any) {
      toast.error("Failed to update workshop: " + error.message);
    }
  };

  if (!isOpen) return null;

  const isLoading =
    updateWorkshop.isPending ||
    uploadImage.isPending ||
    isUploadingNewVideo ||
    isUploading;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Workshop</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-6">
            <div>
              <Label>Banner Image</Label>
              <div
                className="relative mt-2 flex h-48 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 transition-colors hover:border-primary/50"
                onClick={() => bannerInputRef.current?.click()}
              >
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleBannerSelect}
                />
                {bannerPreview ? (
                  <div className="relative h-full w-full">
                    <img
                      src={bannerPreview}
                      alt="Banner preview"
                      className="h-full w-full rounded-lg object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="mt-2 text-sm text-gray-500">
                      Click to upload banner image
                      <p className="text-xs text-gray-400">
                        JPEG, PNG, WebP up to 5MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Introductory Video</Label>
              <div className="mt-2 space-y-2 rounded-lg border border-dashed p-3">
                {isUploadingNewVideo ? (
                  <div className="w-full">
                    <div className="mt-1 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-2.5 rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${videoUploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="mt-1 text-center text-xs text-muted-foreground">
                      Uploading video directly to storage...{" "}
                      {videoUploadProgress}%
                    </p>
                  </div>
                ) : newIntroVideoPreview ? (
                  <video
                    src={newIntroVideoPreview}
                    controls
                    className="max-h-60 w-full rounded-md"
                  />
                ) : currentIntroVideoUrl ? (
                  <video
                    src={currentIntroVideoUrl}
                    controls
                    className="max-h-60 w-full rounded-md"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No introductory video uploaded.
                  </p>
                )}
                <Input
                  id="newIntroVideo"
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                  className="hidden"
                  ref={introVideoInputRef}
                  onChange={handleNewIntroVideoSelect}
                  disabled={isLoading || isUploadingNewVideo}
                />
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 transition-all hover:bg-primary/5"
                    onClick={() => introVideoInputRef.current?.click()}
                    disabled={isLoading || isUploadingNewVideo}
                  >
                    <VideoIcon className="mr-2 h-5 w-5" />
                    {currentIntroVideoUrl
                      ? "Change Video"
                      : "Upload Video"}{" "}
                    (Max 50MB)
                  </Button>
                  {newIntroVideoFile && !isUploadingNewVideo && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => {
                        setNewIntroVideoFile(null);
                        setNewIntroVideoPreview("");
                        if (introVideoInputRef.current)
                          introVideoInputRef.current.value = "";
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {newIntroVideoFile && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Selected: {newIntroVideoFile.name} (
                    {Math.round((newIntroVideoFile.size / 1024 / 1024) * 10) /
                      10}{" "}
                    MB)
                  </div>
                )}
                {currentIntroVideoUrl &&
                  !newIntroVideoFile &&
                  !isUploadingNewVideo && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={async () => {
                        // Update workshop to remove the video URL
                        await updateWorkshopVideoUrlMutation.mutateAsync({
                          workshopId: workshop.id,
                          videoUrl: "", // Empty string to remove the video
                        });
                        setCurrentIntroVideoUrl(null);
                      }}
                      disabled={isLoading}
                    >
                      <X className="mr-1 h-4 w-4" /> Remove Existing Video
                    </Button>
                  )}
              </div>
            </div>

            <div>
              <Label htmlFor="name">Workshop Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="e.g., Web Development Bootcamp"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Describe what students will learn in this workshop"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numberOfDays">Number of Days</Label>
                <Input
                  id="numberOfDays"
                  name="numberOfDays"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={form.numberOfDays}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  name="price"
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*[.,]?[0-9]*"
                  value={form.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label>Workshop Schedule</Label>
              <div className="mt-1">
                <Label htmlFor="scheduleType" className="text-sm font-medium">
                  Schedule Type
                </Label>
                <Select
                  value={form.scheduleType}
                  onValueChange={(value: "recurring" | "custom") => {
                    handleInputChange({
                      target: { name: "scheduleType", value },
                    } as React.ChangeEvent<HTMLSelectElement>);
                  }}
                >
                  <SelectTrigger id="scheduleType" className="mt-1 w-full">
                    <SelectValue placeholder="Select schedule type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recurring">Recurring</SelectItem>
                    <SelectItem value="custom">
                      Custom (Specific Dates)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional Start Date for Recurring Schedule */}
              {form.scheduleType === "recurring" && (
                <div className="mt-3">
                  <Label htmlFor="startDate">Start Date (for Recurring)</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Optional for recurring. If set, first session will be on or
                    after this date.
                  </p>
                </div>
              )}

              <div className="mt-4 space-y-2 rounded-lg border border-gray-100 bg-gray-50/50 p-3">
                {form.scheduleType === "recurring"
                  ? recurringSchedule.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Select
                          value={item.day}
                          onValueChange={(value) =>
                            handleRecurringScheduleChange(index, "day", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "Monday",
                              "Tuesday",
                              "Wednesday",
                              "Thursday",
                              "Friday",
                              "Saturday",
                              "Sunday",
                            ].map((day) => (
                              <SelectItem key={day} value={day}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={item.time}
                          onValueChange={(value) =>
                            handleRecurringScheduleChange(index, "time", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "8:00 AM",
                              "9:00 AM",
                              "10:00 AM",
                              "11:00 AM",
                              "12:00 PM",
                              "1:00 PM",
                              "2:00 PM",
                              "3:00 PM",
                              "4:00 PM",
                              "5:00 PM",
                              "6:00 PM",
                              "7:00 PM",
                              "8:00 PM",
                              "9:00 PM",
                              "10:00 PM",
                              "11:00 PM",
                              "12:00 AM",
                              "1:00 AM",
                              "2:00 AM",
                              "3:00 AM",
                              "4:00 AM",
                              "5:00 AM",
                              "6:00 AM",
                              "7:00 AM",
                            ].map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRecurringScheduleItem(index)}
                          disabled={recurringSchedule.length <= 1}
                          className="transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  : customSchedule.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          type="date"
                          value={item.date}
                          onChange={(e) =>
                            handleCustomScheduleChange(
                              index,
                              "date",
                              e.target.value,
                            )
                          }
                        />

                        <Select
                          value={item.time}
                          onValueChange={(value) =>
                            handleCustomScheduleChange(index, "time", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "8:00 AM",
                              "9:00 AM",
                              "10:00 AM",
                              "11:00 AM",
                              "12:00 PM",
                              "1:00 PM",
                              "2:00 PM",
                              "3:00 PM",
                              "4:00 PM",
                              "5:00 PM",
                              "6:00 PM",
                              "7:00 PM",
                              "8:00 PM",
                              "9:00 PM",
                              "10:00 PM",
                              "11:00 PM",
                              "12:00 AM",
                              "1:00 AM",
                              "2:00 AM",
                              "3:00 AM",
                              "4:00 AM",
                              "5:00 AM",
                              "6:00 AM",
                              "7:00 AM",
                            ].map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCustomScheduleItem(index)}
                          disabled={customSchedule.length <= 1}
                          className="transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                {form.scheduleType === "recurring" ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addRecurringScheduleItem}
                    className="mt-2 w-full transition-all hover:bg-primary/5 sm:w-auto"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Schedule
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCustomScheduleItem}
                    className="mt-2 w-full transition-all hover:bg-primary/5 sm:w-auto"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Schedule
                  </Button>
                )}
              </div>
            </div>

            <div>
              <Label>Learning Outcomes</Label>
              <div className="mt-2 space-y-2 rounded-lg border border-gray-100 bg-gray-50/50 p-3">
                {form.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={outcome}
                      onChange={(e) =>
                        handleLearningOutcomeChange(index, e.target.value)
                      }
                      placeholder={`Outcome ${index + 1}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLearningOutcome(index)}
                      disabled={form.learningOutcomes.length <= 1}
                      className="transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLearningOutcome}
                  className="mt-2 w-full transition-all hover:bg-primary/5 sm:w-auto"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Outcome
                </Button>
              </div>
            </div>

            <div>
              <Label>Course Details</Label>
              <p className="mb-2 text-xs text-muted-foreground">
                Define content for each day. Number of days ({form.numberOfDays}
                ) is set above.
              </p>
              <div className="mt-2 space-y-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3">
                {Object.keys(courseDetails).map((day) => (
                  <div key={day}>
                    <Label
                      htmlFor={`${day}-desc`}
                      className="text-sm font-medium"
                    >
                      {day} Description
                    </Label>
                    <Textarea
                      id={`${day}-desc`}
                      value={courseDetails[day]?.description || ""}
                      onChange={(e) =>
                        handleCourseDetailChange(
                          day,
                          "description",
                          e.target.value,
                        )
                      }
                      placeholder={`What will be covered on ${day}`}
                      rows={2}
                    />
                    <div className="mt-2 flex items-center space-x-2">
                      <Checkbox
                        id={`${day}-isFree`}
                        checked={courseDetails[day]?.isFreeSession || false}
                        onCheckedChange={(checked) =>
                          handleCourseDetailChange(
                            day,
                            "isFreeSession",
                            !!checked,
                          )
                        }
                      />
                      <Label
                        htmlFor={`${day}-isFree`}
                        className="text-sm font-normal text-gray-700"
                      >
                        This is a free session for enrolled students
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="otherDetails">Other Details (Optional)</Label>
              <Textarea
                id="otherDetails"
                name="otherDetails"
                value={form.otherDetails}
                onChange={handleInputChange}
                placeholder="Any additional information about the workshop"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="mentorGmailId">Mentor Gmail ID</Label>
              <Input
                id="mentorGmailId"
                name="mentorGmailId"
                type="email"
                value={form?.mentorGmailId}
                onChange={handleInputChange}
                placeholder="mentor@gmail.com"
                required
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Required for Google Meet integration. Must be a @gmail.com
                address.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="w-full transition-all hover:bg-primary/5 sm:w-auto"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary transition-all hover:bg-primary/90 sm:w-auto"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
