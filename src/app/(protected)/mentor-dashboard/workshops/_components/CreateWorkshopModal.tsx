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
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, Calendar, Camera, Video as VideoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TRPCError } from "@trpc/server";

interface CreateWorkshopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type RecurringScheduleItem = {
  day: string;
  time: string;
};

type CustomScheduleItem = {
  date: string;
  time: string;
};

// Helper function to ensure we always have a string date
const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0] || "";
};

export default function CreateWorkshopModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateWorkshopModalProps) {
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false); 
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // New state for introductory video
  const [introVideoFile, setIntroVideoFile] = useState<File | null>(null);
  const [introVideoPreview, setIntroVideoPreview] = useState<string>("");
  const introVideoInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);

  const [form, setForm] = useState({
    name: "",
    description: "",
    numberOfDays: "1",
    price: "0",
    learningOutcomes: [""],
    otherDetails: "",
    scheduleType: "recurring" as "recurring" | "custom",
    startDate: "", 
    mentorGmailId: "",
  });

  // For recurring schedule (day and time)
  const [recurringSchedule, setRecurringSchedule] = useState<RecurringScheduleItem[]>([
    { day: "Monday", time: "10:00 AM" },
  ]);
  
  // For custom schedule (specific date and time for each session)
  const [customSchedule, setCustomSchedule] = useState<CustomScheduleItem[]>([
    { date: getTodayDateString(), time: "10:00 AM" },
  ]);

  const [courseDetails, setCourseDetails] = useState<Record<string, {description: string, isFreeSession: boolean}>>({
    "Day 1": {
      description: "",
      isFreeSession: false,
    },
  });

  // useEffect to sync customSchedule length with numberOfDays when scheduleType is 'custom'
  useEffect(() => {
    if (form.scheduleType === 'custom') {
      const numDays = parseInt(form.numberOfDays, 10);

      if (!isNaN(numDays) && numDays > 0) {
        if (numDays !== customSchedule.length) { // Only update if length is different
            const currentCustomLength = customSchedule.length;
            if (numDays > currentCustomLength) {
            const newEntries = Array(numDays - currentCustomLength)
                .fill(null)
                .map(() => ({
                date: getTodayDateString(), // Uses the helper function
                time: '10:00 AM', // Default time
                }));
            setCustomSchedule(prevSchedule => [...prevSchedule, ...newEntries]);
            } else { // numDays < currentCustomLength
            setCustomSchedule(prevSchedule => prevSchedule.slice(0, numDays));
            }
        }
      } else if (form.numberOfDays === "" || numDays <= 0) {
        // If numberOfDays is empty or invalid (e.g., 0 or negative),
        // reset customSchedule to a single default entry.
        // This check prevents unnecessary updates if it's already the default.
        const today = getTodayDateString(); // Cache for comparison
        if (customSchedule.length !== 1 || 
            customSchedule[0]?.date !== today || 
            customSchedule[0]?.time !== "10:00 AM") {
           setCustomSchedule([{ date: today, time: "10:00 AM" }]);
        }
      }
    }
    // If scheduleType is not 'custom', this effect does nothing, preserving customSchedule.
    // Resetting of customSchedule when switching away from 'custom' is handled in handleInputChange.
  }, [form.numberOfDays, form.scheduleType, customSchedule.length]); // Dependencies

  // Helper to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(new Error("File reading failed: " + error.target?.error?.message));
    });
  };

  const uploadWorkshopVideo = api.workshop.uploadWorkshopIntroVideo.useMutation({
    onSuccess: () => {
      toast.success("Workshop introductory video uploaded!");
    },
    onError: (error) => {
      toast.error("Failed to upload video: " + error.message);
    },
  });

  const createWorkshop = api.workshop.createWorkshop.useMutation({
    onSuccess: async (createdWorkshopData) => {
      let videoUploadSuccess = true;
      if (introVideoFile && createdWorkshopData?.id) {
        // Use the new direct upload method instead of base64
        const uploadResult = await directVideoUpload(createdWorkshopData.id);
        if (!uploadResult) {
          videoUploadSuccess = false;
        }
      }

      if (videoUploadSuccess) {
        toast.success("Workshop created successfully!");
        resetForm();
        onSuccess(); 
      } else {
        toast.error("Workshop created, but video upload failed. You can add it later by editing the workshop.");
        resetForm(); 
        onSuccess();
      }
    },
    onError: (error) => {
      setIsUploading(false); 
      const message = error?.shape?.message || "Failed to create workshop.";
      toast.error(message);
    },
  });

  const uploadImage = api.file.upload.useMutation({
    onSuccess: (data) => {
      if (data?.url) {
        createWorkshop.mutate({
          name: form.name,
          description: form.description,
          numberOfDays: parseInt(form.numberOfDays),
          bannerImage: data.url,
          scheduleType: form.scheduleType,
          startDate: form.startDate || undefined,
          schedule: form.scheduleType === "recurring" ? recurringSchedule : customSchedule,
          price: parseInt(form.price) * 100, 
          learningOutcomes: form.learningOutcomes.filter((outcome) => outcome.trim() !== ""),
          courseDetails,
          otherDetails: form.otherDetails,
          mentorGmailId: form.mentorGmailId, // Pass directly as it's now required
        });
      } else {
        setIsUploading(false);
        toast.error("Banner upload succeeded but URL was not returned.");
      }
    },
    onError: (error) => {
      setIsUploading(false);
      toast.error("Failed to upload banner: " + error.message);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Validate number inputs
    if (name === "numberOfDays") {
      const days = parseInt(value);
      if (value !== "" && (!Number.isInteger(days) || days <= 0)) {
        toast.error("Number of days must be a positive integer");
        return;
      }
    } else if (name === "price") {
      const price = parseFloat(value);
      if (value !== "" && (isNaN(price) || price < 0)) {
        toast.error("Price must be a non-negative number");
        return;
      }
    }

    setForm({
      ...form,
      [name]: value
    });

    // If number of days changes, update course details
    if (name === "numberOfDays") {
      const days = parseInt(value);
      if (!isNaN(days) && days > 0) {
        const newCourseDetails: Record<string, {description: string, isFreeSession: boolean}> = {};
        for (let i = 1; i <= days; i++) {
          const dayKey = `Day ${i}`;
          // If the day already exists in courseDetails, preserve its properties
          // Otherwise initialize with empty description and isFreeSession = false
          newCourseDetails[dayKey] = courseDetails[dayKey] || {
            description: "",
            isFreeSession: false
          };
        }
        setCourseDetails(newCourseDetails);
        
        // Also update custom schedule if needed
        if (form.scheduleType === "custom" && customSchedule.length < days) {
          const newCustomSchedule = [...customSchedule];
          while (newCustomSchedule.length < days) {
            newCustomSchedule.push({ 
              date: getTodayDateString(), 
              time: "10:00 AM" 
            });
          }
          setCustomSchedule(newCustomSchedule);
        }
      }
    }
  };
  
  // Handle recurring schedule changes
  const handleRecurringScheduleChange = (index: number, field: string, value: string) => {
    const newSchedule = [...recurringSchedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value } as { day: string; time: string };
    setRecurringSchedule(newSchedule);
  };

  const addRecurringScheduleItem = () => {
    setRecurringSchedule([...recurringSchedule, { day: "Monday", time: "10:00 AM" }]);
  };

  const removeRecurringScheduleItem = (index: number) => {
    if (recurringSchedule.length > 1) {
      setRecurringSchedule(recurringSchedule.filter((_, i) => i !== index));
    }
  };
  
  // Handle custom schedule changes
  const handleCustomScheduleChange = (index: number, field: string, value: string) => {
    const newSchedule = [...customSchedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value } as { date: string; time: string };
    setCustomSchedule(newSchedule);
  };

  const addCustomScheduleItem = () => {
    if (customSchedule.length < Number(form.numberOfDays)) {
      setCustomSchedule([...customSchedule, { 
        date: getTodayDateString(), 
        time: "10:00 AM" 
      }]);
    }
  };

  const removeCustomScheduleItem = (index: number) => {
    if (customSchedule.length > 1) {
      setCustomSchedule(customSchedule.filter((_, i) => i !== index));
    }
  };

  const handleCourseDetailChange = (day: string, value: string) => {
    setCourseDetails((prevDetails) => {
      const current = prevDetails[day] ?? { description: "", isFreeSession: false };
      return {
        ...prevDetails,
        [day]: {
          ...current,
          description: value,
        },
      };
    });
  };
  
  const handleFreeSessionToggle = (day: string, isFree: boolean) => {
    setCourseDetails((prevDetails) => {
      const current = prevDetails[day] ?? { description: "", isFreeSession: false };
      return {
        ...prevDetails,
        [day]: {
          ...current,
          isFreeSession: isFree,
        },
      };
    });
  };
  

  const handleLearningOutcomeChange = (index: number, value: string) => {
    const newOutcomes = [...form.learningOutcomes];
    newOutcomes[index] = value;
    setForm({ ...form, learningOutcomes: newOutcomes });
  };

  const addLearningOutcome = () => {
    setForm({
      ...form,
      learningOutcomes: [...form.learningOutcomes, ""],
    });
  };

  const removeLearningOutcome = (index: number) => {
    if (form.learningOutcomes.length > 1) {
      setForm({
        ...form,
        learningOutcomes: form.learningOutcomes.filter((_, i) => i !== index),
      });
    }
  };
// Handler for intro video selection
const handleIntroVideoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const allowedTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
    const maxSize = 50 * 1024 * 1024; // 50MB for direct upload

    if (!allowedTypes.includes(file.type)) {
      toast.error(`Invalid video type. Allowed: MP4, WebM, MOV.`);
      if (introVideoInputRef.current) introVideoInputRef.current.value = "";
      setIntroVideoFile(null);
      setIntroVideoPreview("");
      return;
    }

    if (file.size > maxSize) {
      toast.error("Video file is too large (max 50MB).");
      if (introVideoInputRef.current) introVideoInputRef.current.value = "";
      setIntroVideoFile(null);
      setIntroVideoPreview("");
      return;
    }

    setIntroVideoFile(file);
    setIntroVideoPreview(URL.createObjectURL(file));
  } else {
    setIntroVideoFile(null);
    setIntroVideoPreview("");
  }
};

const getSignedUploadUrlMutation = api.file.getSignedUploadUrl.useMutation();
const updateWorkshopVideoUrlMutation = api.workshop.updateWorkshopVideoUrl.useMutation();

// Function to upload video directly to bucket using signed URL
const directVideoUpload = async (workshopId: string): Promise<string | null> => {
  if (!introVideoFile) return null;
  
  setIsUploadingVideo(true);
  setVideoUploadProgress(0);
  
  try {
    // Step 1: Get a signed URL for direct upload
    const signedUrlResult = await getSignedUploadUrlMutation.mutateAsync({
      bucketName: "dc-public-files",
      folderName: "dc-ws-intro-video",
      fileName: introVideoFile.name,
      fileType: introVideoFile.type,
      // We don't have initialVideoUrl for a new workshop
    });
    
    if (!signedUrlResult.success || !signedUrlResult.signedUrl) {
      throw new Error("Failed to get signed upload URL");
    }
    
    // Step 2: Use fetch with XMLHttpRequest to upload directly to the bucket with progress tracking
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setVideoUploadProgress(percentComplete);
        }
      });
      
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });
      
      xhr.addEventListener("error", (event) => {
        console.error('XHR upload error:', event);
        // Check if the error might be CORS-related
        if (xhr.status === 0) {
          reject(new Error("Network error during upload: This might be a CORS issue. Check your bucket CORS configuration."));
        } else {
          reject(new Error(`Network error during upload: Status ${xhr.status} - ${xhr.statusText || 'Unknown error'}`));
        }
      });
      
      xhr.addEventListener("abort", () => {
        reject(new Error("Upload aborted"));
      });
      
      // Open connection and set headers
      xhr.open("PUT", signedUrlResult.signedUrl);
      xhr.setRequestHeader("Content-Type", introVideoFile.type);
      xhr.setRequestHeader("x-goog-content-length-range","0,52428800");
      
      // Start upload
      xhr.send(introVideoFile);
    });
    
    // Step 3: Update the workshop with the public URL
    await updateWorkshopVideoUrlMutation.mutateAsync({
      workshopId,
      videoUrl: signedUrlResult.publicUrl,
    });
    
    return signedUrlResult.publicUrl;
  } catch (error: any) {
    console.error("Direct video upload failed:", error);
    toast.error(`Video upload failed: ${error.message || "Unknown error"}`);
    return null;
  } finally {
    setIsUploadingVideo(false);
    setVideoUploadProgress(0);
  }
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!form.name.trim() || !form.description.trim()) {
    toast.error("Workshop name and description are required.");
    return;
  }
  if (parseInt(form.numberOfDays) <= 0) {
    toast.error("Number of days must be greater than 0.");
    return;
  }
  if (parseInt(form.price) < 0) {
    toast.error("Price cannot be negative.");
    return;
  }
  if (!form.mentorGmailId) {
    toast.error("Mentor Gmail ID is required.");
    return;
  }
  // Basic email format validation
  if (!/^\S+@\S+\.\S+$/.test(form.mentorGmailId)) {
    toast.error("Invalid email format for Mentor Gmail ID.");
    return;
  }
  if (!form.mentorGmailId.endsWith("@gmail.com")) {
    toast.error("Mentor Gmail ID must be a Gmail address (e.g., your.email@gmail.com).");
    return;
  }

  setIsUploading(true);

  if (bannerImage) {
    try {
      const bannerBase64 = await fileToBase64(bannerImage);
      if (!bannerBase64) throw new Error("Failed to convert banner image to base64");

      uploadImage.mutate({
        bucketName: "dc-public-files",
        folderName: "dc-ws-banner",
        fileName: bannerImage.name,
        fileType: bannerImage.type,
        fileContent: bannerBase64.split(',')[1] || "",
      });
    } catch (error) {
      setIsUploading(false);
      toast.error("Error processing banner image.");
      return;
    }
  } else {
    createWorkshop.mutate({
      name: form.name,
      description: form.description,
      numberOfDays: parseInt(form.numberOfDays),
      scheduleType: form.scheduleType,
      startDate: form.startDate || undefined,
      schedule: form.scheduleType === "recurring" ? recurringSchedule : customSchedule,
      price: parseInt(form.price) * 100,
      learningOutcomes: form.learningOutcomes.filter(outcome => outcome.trim() !== ""),
      courseDetails,
      otherDetails: form.otherDetails,
      mentorGmailId: form.mentorGmailId, // Pass directly as it's now required
    });
  }
};

const resetForm = () => {
  setForm({
    name: "",
    description: "",
    numberOfDays: "1",
    price: "0",
    learningOutcomes: [""],
    otherDetails: "",
    scheduleType: "recurring",
    startDate: "",
    mentorGmailId: "",
  });

  setBannerImage(null);
  setBannerPreview("");
  if (bannerInputRef.current) bannerInputRef.current.value = "";

  setIntroVideoFile(null);
  setIntroVideoPreview("");
  if (introVideoInputRef.current) introVideoInputRef.current.value = "";

  setRecurringSchedule([{ day: "Monday", time: "10:00 AM" }]);
  setCustomSchedule([{ date: getTodayDateString(), time: "10:00 AM" }]);
  setCourseDetails({
    "Day 1": {
      description: "",
      isFreeSession: false,
    },
  });

  setIsUploading(false);
  setIsUploadingVideo(false); // Optional: remove if unused elsewhere
};

useEffect(() => {
  const days = parseInt(form.numberOfDays) || 0;
  const newCourseDetails: Record<string, { description: string; isFreeSession: boolean }> = {};
  for (let i = 1; i <= days; i++) {
    const dayKey = `Day ${i}`;
    newCourseDetails[dayKey] = courseDetails[dayKey] || {
      description: "",
      isFreeSession: false,
    };
  }
  setCourseDetails(newCourseDetails);

  if (form.scheduleType === "custom" && customSchedule.length > days && days > 0) {
    setCustomSchedule(prev => prev.slice(0, days));
  }
}, [form.numberOfDays, form.scheduleType]);

if (!isOpen) return null;

return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Workshop</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
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

            <div className="grid gap-4 py-4">
              <div>
                <Label>Workshop Banner</Label>
                <div 
                  className="mt-2 relative h-[200px] w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50/50 cursor-pointer"
                  onClick={() => bannerInputRef.current?.click()}
                >
                  {bannerPreview ? (
                    <img 
                      src={bannerPreview} 
                      alt="Workshop banner preview" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="text-center">
                        <Camera className="mx-auto h-8 w-8 text-gray-400" />
                        <span className="mt-2 block text-sm text-gray-500">Upload 4:1 aspect ratio image for best results </span>
                        <p className="text-xs text-gray-500">Recommended size: 1600x400px</p>
                      </div>
                    </div>
                  )}
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const ALLOWED_IMAGE_TYPES = [
                        "image/jpeg", 
                        "image/png", 
                        "image/webp"
                      ];

                      if (!file.type || !ALLOWED_IMAGE_TYPES.includes(file.type)) {
                        toast.error("Please select an image file (JPEG, PNG, or WebP)");
                        return;
                      }

                      if (file.size > 5 * 1024 * 1024) {
                        toast.error("Image size should be less than 5MB");
                        return;
                      }

                      setBannerImage(file);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setBannerPreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }}
                    disabled={isUploading}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Introductory Video (Optional)</Label>
              <div className="mt-2 flex flex-col items-center space-y-2 p-3 border border-dashed rounded-lg">
                <Input
                  id="introVideo"
                  type="file"
                  ref={introVideoInputRef}
                  accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                  className="hidden"
                  onChange={handleIntroVideoSelect}
                />
                <div className="flex items-center gap-2 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => introVideoInputRef.current?.click()}
                    className="flex-1 text-muted-foreground hover:text-foreground transition-all hover:bg-primary/5"
                    disabled={isUploadingVideo}
                  >
                    {introVideoFile ? "Change Video (max 50MB)" : "Upload Video (max 50MB)"}
                  </Button>
                  {introVideoFile && !isUploadingVideo && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                      onClick={() => {
                        setIntroVideoFile(null);
                        setIntroVideoPreview("");
                        if (introVideoInputRef.current) introVideoInputRef.current.value = "";
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {introVideoFile && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Selected: {introVideoFile.name} ({Math.round(introVideoFile.size / 1024 / 1024 * 10) / 10} MB)
                  </div>
                )}
                {isUploadingVideo && (
                  <div className="mt-2 w-full">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-1">
                      <div 
                        className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${videoUploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Uploading video directly to storage... {videoUploadProgress}%
                    </p>
                  </div>
                )}
                {introVideoPreview && !isUploadingVideo && (
                  <div className="mt-2 rounded-md overflow-hidden border border-border w-full">
                    <video controls className="w-full h-auto max-h-40" src={introVideoPreview}></video>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numberOfDays">Number of Days</Label>
                <Input
                  id="numberOfDays"
                  name="numberOfDays"
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
                  value={form.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="scheduleType">Schedule Type</Label>
              <Select
                value={form.scheduleType}
                onValueChange={(value) => setForm({...form, scheduleType: value as "recurring" | "custom"})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select schedule type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recurring">Recurring Schedule</SelectItem>
                  <SelectItem value="custom">Custom Dates</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.scheduleType === "recurring" && (
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  min={new Date().toISOString().split("T")[0]} // disables past dates
                  value={form.startDate}
                  onChange={handleInputChange}
                  required
                />
                <div className="mt-4">
                  <Label>Recurring Schedule</Label>
                  <div className="space-y-2 mt-2 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                    {recurringSchedule.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Select
                          value={item.day}
                          onValueChange={(value) => handleRecurringScheduleChange(index, "day", value)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                          <SelectContent>
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                              <SelectItem key={day} value={day}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={item.time}
                          onValueChange={(value) => handleRecurringScheduleChange(index, "time", value)}
                        >
                          <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                          {["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM", "12:00 AM", "1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM", "6:00 AM", "7:00 AM"].map((time) => {
                            // Only disable past times if the selected day is today
                            
                            return (
                            <SelectItem 
                              key={time} 
                              value={time} 
                              
                            >
                              {time} 
                            </SelectItem>
                            );
                          })}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRecurringScheduleItem(index)}
                          disabled={recurringSchedule.length <= 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addRecurringScheduleItem}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Schedule
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {form.scheduleType === "custom" && (
              <div>
                <Label>Custom Schedule</Label>
                <div className="space-y-2 mt-2 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                  {customSchedule.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1">
                        <Label htmlFor={`date-${index}`} className="sr-only">Date</Label>
                        <Input
                          id={`date-${index}`}
                          type="date"
                          min={new Date().toISOString().split("T")[0]} // disables past dates
                          value={item.date}
                          onChange={(e) => handleCustomScheduleChange(index, "date", e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={`time-${index}`} className="sr-only">Time</Label>
                        <Select
                          value={item.time}
                          onValueChange={(value) => handleCustomScheduleChange(index, "time", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM", "12:00 AM", "1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM", "6:00 AM", "7:00 AM"].map((time) => {
                              // Check if selected date is today
                              const isToday = item.date === new Date().toISOString().split("T")[0];
                              const currentHour = new Date().getHours();
                              
                              // Parse the time to get hour value
                              const timeHour = parseInt(time.split(':')[0] || "0") + 
                                               (time.includes('PM') && time.split(':')[0] !== '12' ? 12 : 0) - 
                                               (time.includes('AM') && time.split(':')[0] === '12' ? 12 : 0);
                              
                              // Disable if it's today and the time has passed
                              const disabled = isToday && timeHour <= currentHour;
                              
                              return (
                                <SelectItem 
                                  key={time} 
                                  value={time} 
                                  disabled={disabled}
                                  className={disabled ? "opacity-50 cursor-not-allowed" : ""}
                                >
                                  {time} {disabled ? "(Past)" : ""}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCustomScheduleItem(index)}
                        disabled={customSchedule.length <= 1}
                        className="hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {customSchedule.length < Number(form.numberOfDays) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCustomScheduleItem}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Date
                    </Button>
                  )}
                </div>
              </div>
            )}

            <div>
              <Label>Learning Outcomes</Label>
              <div className="space-y-2 mt-2 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
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
                  className="mt-2 w-full sm:w-auto transition-all hover:bg-primary/5"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Outcome
                </Button>
              </div>
            </div>

            <div>
              <Label>Course Details</Label>
              <div className="space-y-3 mt-2 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                {Object.keys(courseDetails).map((day) => (
                  <div key={day} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor={day} className="text-sm font-medium">
                        {day}
                      </Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`${day}-free`}
                          checked={courseDetails[day]?.isFreeSession}
                          onChange={(e) => 
                            handleFreeSessionToggle(day, e.target.checked)
                          }
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/20"
                        />
                        <Label htmlFor={`${day}-free`} className="text-xs font-medium cursor-pointer">
                          Free Session
                        </Label>
                      </div>
                    </div>
                    <Textarea
                      id={day}
                      value={courseDetails[day]?.description}
                      onChange={(e) =>
                        handleCourseDetailChange(day, e.target.value)
                      }
                      placeholder={`What will be covered on ${day}`}
                      rows={2}
                    />
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
              <Label htmlFor="mentorGmailId">Mentor Gmail ID <span className="text-red-500">*</span></Label>
              <Input
                id="mentorGmailId"
                name="mentorGmailId"
                value={form.mentorGmailId}
                onChange={handleInputChange}
                placeholder="your.email@gmail.com"
                required
              />
              <div className="text-xs text-muted-foreground">
                Must be a valid Gmail address. Required for Google Meet integration.
              </div>
            </div>

          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto transition-all hover:bg-primary/5"
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={uploadImage.isPending || createWorkshop.isPending || isUploadingVideo || isUploading}
              className="w-full sm:w-auto transition-all ">
              {isUploadingVideo 
                ? "Uploading Video..." 
                : (uploadImage.isPending 
                  ? "Uploading Banner..." 
                  : (createWorkshop.isPending 
                    ? "Creating Workshop..." 
                    : "Create Workshop"))}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
