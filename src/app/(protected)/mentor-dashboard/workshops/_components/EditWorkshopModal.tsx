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
  courseDetails: Record<string, any>;
  otherDetails: string | null;
  bannerImage: string | null;
  introductoryVideoUrl?: string | null;
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

  const [currentIntroVideoUrl, setCurrentIntroVideoUrl] = useState<string | null>(
    null
  );
  const [newIntroVideoFile, setNewIntroVideoFile] = useState<File | null>(null);
  const [newIntroVideoPreview, setNewIntroVideoPreview] = useState<string>("");
  const introVideoInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingNewVideo, setIsUploadingNewVideo] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    numberOfDays: 1,
    price: 0,
    learningOutcomes: [""],
    otherDetails: "",
    scheduleType: "recurring" as "recurring" | "custom",
    startDate: "",
  });

  const [recurringSchedule, setRecurringSchedule] = useState<RecurringScheduleItem[]>([
    { day: "Monday", time: "10:00 AM" },
  ]);
  const [customSchedule, setCustomSchedule] = useState<CustomScheduleItem[]>([
    { date: new Date().toISOString().split("T")[0] || "", time: "10:00 AM" },
  ]);

  const [courseDetails, setCourseDetails] = useState<Record<string, string>>({
    "Day 1": "",
  });

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(new Error("File reading failed: " + error));
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
        numberOfDays: workshop.numberOfDays,
        price: workshop.price / 100,
        learningOutcomes: workshop.learningOutcomes.length > 0
          ? workshop.learningOutcomes
          : [""],
        otherDetails: workshop.otherDetails || "",
        scheduleType: workshop.scheduleType || "recurring",
        startDate: workshop.startDate? new Date(workshop.startDate).toISOString().split("T")[0] || "": "",
      });

      if (workshop.scheduleType === "custom" && Array.isArray(workshop.schedule)) {
        setCustomSchedule(
          workshop.schedule.map((s: Partial<CustomScheduleItem>) => ({
            date: s.date
              ? s.date.includes("T")
                ? new Date(s.date).toISOString().split("T")[0] || ""
                : s.date || ""
              : new Date().toISOString().split("T")[0] || "",
            time: s.time || "10:00 AM",
          }))
        );
        setRecurringSchedule([{ day: "Monday", time: "10:00 AM" }]);
      } else if (workshop.scheduleType === "recurring" && Array.isArray(workshop.schedule)) {
        setRecurringSchedule(
          workshop.schedule.map((s: Partial<RecurringScheduleItem>) => ({
            day: s.day || "Monday",
            time: s.time || "10:00 AM",
          }))
        );
        setCustomSchedule([{ date: new Date().toISOString().split("T")[0] || "", time: "10:00 AM" }]);
      } else {
        setRecurringSchedule([{ day: "Monday", time: "10:00 AM" }]);
        setCustomSchedule([{ date: new Date().toISOString().split("T")[0] || "", time: "10:00 AM" }]);
      }

      setCourseDetails(workshop.courseDetails as Record<string, string> || { "Day 1": "" });
    }
  }, [workshop]);

  const uploadWorkshopVideo = api.workshop.uploadWorkshopIntroVideo.useMutation({
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
  });

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => {
      let newStartDate = prevForm.startDate;
      if (name === "scheduleType") {
        if (value === "custom") {
          newStartDate = ""; // Clear startDate when switching to custom
        } else if (value === "recurring" && !prevForm.startDate) {
          // Optionally set a default start date if switching to recurring and it's empty
          // newStartDate = new Date().toISOString().split('T')[0]; 
        }
      }
      return {
        ...prevForm,
        [name]: (name === "price" || name === "numberOfDays") && value !== "" ? Number(value) : value,
        startDate: name === "scheduleType" ? newStartDate : prevForm.startDate,
      };
    });

    if (name === "numberOfDays") {
      const days = parseInt(value) || 0;
      const newCourseDetails: Record<string, string> = {};
      for (let i = 1; i <= days; i++) {
        newCourseDetails[`Day ${i}`] = courseDetails[`Day ${i}`] || "";
      }
      setCourseDetails(newCourseDetails);
      if (form.scheduleType === "custom" && customSchedule.length > days && days > 0) {
        setCustomSchedule((prev) => prev.slice(0, days));
      }
    } else if (name === "scheduleType") {
      if (value === "recurring") {
        setCustomSchedule([{ date: new Date().toISOString().split("T")[0] || "", time: "10:00 AM" }]);
      } else {
        setRecurringSchedule([{ day: "Monday", time: "10:00 AM" }]);
      }
    }
  };

  const handleRecurringScheduleChange = (
    index: number,
    field: keyof RecurringScheduleItem,
    value: string
  ) => {
    const updated = [...recurringSchedule];
    updated[index] = { ...updated[index], [field]: value } as any ;
    setRecurringSchedule(updated);
  };
  const addRecurringScheduleItem = () =>
    setRecurringSchedule([...recurringSchedule, { day: "Monday", time: "10:00 AM" }]);
  const removeRecurringScheduleItem = (index: number) =>
    setRecurringSchedule(recurringSchedule.filter((_, i) => i !== index));

  const handleCustomScheduleChange = (
    index: number,
    field: keyof CustomScheduleItem,
    value: string
  ) => {
    const updated = [...customSchedule];
    updated[index] = { ...updated[index], [field]: value } as any;
    setCustomSchedule(updated);
  };
  const addCustomScheduleItem = () =>
    setCustomSchedule([...customSchedule, { date: new Date().toISOString().split("T")[0] || "", time: "10:00 AM" }]);
  const removeCustomScheduleItem = (index: number) =>
    setCustomSchedule(customSchedule.filter((_, i) => i !== index));

  const handleCourseDetailChange = (day: string, value: string) => {
    setCourseDetails((prev) => ({ ...prev, [day]: value }));
  };

  const handleLearningOutcomeChange = (index: number, value: string) => {
    const updated = [...form.learningOutcomes];
    updated[index] = value;
    setForm((prev) => ({ ...prev, learningOutcomes: updated }));
  };
  const addLearningOutcome = () =>
    setForm((prev) => ({ ...prev, learningOutcomes: [...prev.learningOutcomes, ""] }));
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

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setBannerImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleNewIntroVideoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"];
      const maxSize = 100 * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid video type. Allowed: MP4, WebM, MOV.`);
        if (introVideoInputRef.current) introVideoInputRef.current.value = "";
        setNewIntroVideoFile(null);
        setNewIntroVideoPreview("");
        return;
      }
      if (file.size > maxSize) {
        toast.error("Video file is too large (max 100MB).");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

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
        setIsUploading(false);
        return;
      }
    }

    if (newIntroVideoFile) {
      setIsUploadingNewVideo(true);
      try {
        const videoBase64 = await fileToBase64(newIntroVideoFile);
        if (!videoBase64) {
          throw new Error("Failed to convert video to base64.");
        }
        await uploadWorkshopVideo.mutateAsync({
          workshopId: workshop.id,
          video: {
            fileName: newIntroVideoFile.name,
            fileType: newIntroVideoFile.type,
            base64Content: videoBase64.split(",")[1] || "",
          },
          currentVideoUrl: workshop.introductoryVideoUrl || undefined,
        });
      } catch (error: any) {
        toast.error("Failed to update video: " + error.message);
      } finally {
        setIsUploadingNewVideo(false);
      }
    }

    updateWorkshop.mutate({
      id: workshop.id,
      name: form.name,
      description: form.description,
      numberOfDays: form.numberOfDays,
      scheduleType: form.scheduleType,
      startDate: form.scheduleType === "recurring" ? form.startDate : undefined,
      schedule: form.scheduleType === "recurring" ? recurringSchedule : customSchedule,
      price: form.price * 100,
      learningOutcomes: form.learningOutcomes.filter((outcome) => outcome.trim() !== ""),
      courseDetails,
      otherDetails: form.otherDetails,
      bannerImage: finalBannerUrl || "",
    });
  };

  if (!isOpen) return null;

  const isLoading = updateWorkshop.isPending || uploadImage.isPending || isUploadingNewVideo || isUploading;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Workshop</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-6">
            <div>
              <Label>Banner Image</Label>
              <div
                className="mt-2 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg h-48 bg-gray-50/50 relative cursor-pointer hover:border-primary/50 transition-colors"
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
                  <div className="relative w-full h-full">
                    <img
                      src={bannerPreview}
                      alt="Banner preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
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
              <div className="mt-2 space-y-2 p-3 border border-dashed rounded-lg">
                {newIntroVideoPreview ? (
                  <video src={newIntroVideoPreview} controls className="w-full rounded-md max-h-60" />
                ) : currentIntroVideoUrl ? (
                  <video src={currentIntroVideoUrl} controls className="w-full rounded-md max-h-60" />
                ) : (
                  <p className="text-sm text-muted-foreground">No introductory video uploaded.</p>
                )}
                <Input
                  id="newIntroVideo"
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                  className="hidden"
                  ref={introVideoInputRef}
                  onChange={handleNewIntroVideoSelect}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full transition-all hover:bg-primary/5"
                  onClick={() => introVideoInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <VideoIcon className="h-5 w-5 mr-2" />
                  {currentIntroVideoUrl || newIntroVideoFile ? "Replace Video" : "Add Video"} (Max 100MB)
                </Button>
                {(newIntroVideoPreview || (currentIntroVideoUrl && !newIntroVideoFile)) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={async () => {
                      if (newIntroVideoFile) {
                        setNewIntroVideoFile(null);
                        setNewIntroVideoPreview("");
                        if (introVideoInputRef.current) introVideoInputRef.current.value = "";
                      } else if (currentIntroVideoUrl) {
                        setIsUploadingNewVideo(true);
                        try {
                          await uploadWorkshopVideo.mutateAsync({
                            workshopId: workshop.id,
                            video: { fileName: "delete", fileType: "delete", base64Content: "delete" },
                            currentVideoUrl: currentIntroVideoUrl,
                          });
                          toast.success("Introductory video removed.");
                        } catch (error: any) {
                          toast.error("Failed to remove videoooooo: " + error.message);
                        } finally {
                          setIsUploadingNewVideo(false);
                        }
                      }
                    }}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4 mr-1" /> Remove Video
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
                  type="number"
                  min={1}
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
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label>Workshop Schedule</Label>
              <div className="space-y-2 mt-2 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                {form.scheduleType === "recurring" ? (
                  recurringSchedule.map((item, index) => (
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
                          {
                            [
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
                            ].map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRecurringScheduleItem(index)}
                        disabled={recurringSchedule.length <= 1}
                        className="hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  customSchedule.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        type="date"
                        value={item.date}
                        onChange={(e) =>
                          handleCustomScheduleChange(index, "date", e.target.value)
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
                          {
                            [
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
                            ].map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>

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
                  ))
                )}
                {form.scheduleType === "recurring" ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addRecurringScheduleItem}
                    className="mt-2 w-full sm:w-auto transition-all hover:bg-primary/5"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Schedule
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCustomScheduleItem}
                    className="mt-2 w-full sm:w-auto transition-all hover:bg-primary/5"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Schedule
                  </Button>
                )}
              </div>
            </div>

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
                      className="hover:bg-red-50 hover:text-red-500 transition-colors"
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
                  <div key={day}>
                    <Label htmlFor={day} className="text-sm font-medium">
                      {day}
                    </Label>
                    <Textarea
                      id={day}
                      value={courseDetails[day]}
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
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto transition-all hover:bg-primary/5"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto transition-all bg-primary hover:bg-primary/90"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
