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
import { X, Plus, Camera } from "lucide-react";

type Workshop = {
  id: string;
  name: string;
  description: string;
  numberOfDays: number;
  schedule: { day: string; time: string }[];
  price: number;
  learningOutcomes: string[];
  courseDetails: Record<string, any>;
  otherDetails: string | null;
  meetUrl: string | null;
  bannerImage: string | null;
  createdAt: Date;
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

  const [form, setForm] = useState({
    name: "",
    description: "",
    numberOfDays: 1,
    price: 0,
    learningOutcomes: [""],
    otherDetails: "",
  });

  const [schedule, setSchedule] = useState<{ day: string; time: string }[]>([
    { day: "Monday", time: "10:00 AM" },
  ]);

  const [courseDetails, setCourseDetails] = useState<Record<string, string>>({
    "Day 1": "",
  });

  // Initialize form with workshop data
  useEffect(() => {
    if (workshop) {
      if (workshop.bannerImage) {
        setBannerPreview(workshop.bannerImage);
      }
      setForm({
        name: workshop.name,
        description: workshop.description,
        numberOfDays: workshop.numberOfDays,
        price: workshop.price / 100, // Convert from paise to rupees
        learningOutcomes: workshop.learningOutcomes.length > 0 
          ? workshop.learningOutcomes 
          : [""],
        otherDetails: workshop.otherDetails || "",
        
      });
      
      setSchedule(workshop.schedule as { day: string; time: string }[]);
      setCourseDetails(workshop.courseDetails as Record<string, string>);
    }
  }, [workshop]);

  const uploadImage = api.file.upload.useMutation({
    onSuccess: (data) => {
      if (data?.url) {
        // After successful image upload, update the workshop with the banner URL
        updateWorkshop.mutate({
          id: workshop.id,
          name: form.name,
          description: form.description,
          numberOfDays: form.numberOfDays,
          schedule,
          price: form.price * 100,
          learningOutcomes: form.learningOutcomes.filter((outcome) => outcome !== ""),
          courseDetails,
          otherDetails: form.otherDetails,
          bannerImage: data.url,
        });
      }
    },
    onError: (error) => {
      setIsUploading(false);
      toast.error("Failed to upload banner: " + error.message);
    },
  });

  const updateWorkshop = api.workshop.updateWorkshop.useMutation({
    onSuccess: () => {
      onSuccess();
    },
    onError: (error : any) => {
      toast.error(error.message);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "price" || name === "numberOfDays" ? Number(value) : value,
    });

    // If number of days changes, update course details
    if (name === "numberOfDays") {
      const days = parseInt(value);
      if (!isNaN(days) && days > 0) {
        const newCourseDetails: Record<string, string> = {};
        for (let i = 1; i <= days; i++) {
          const dayKey = `Day ${i}`;
          newCourseDetails[dayKey] = courseDetails[dayKey] || "";
        }
        setCourseDetails(newCourseDetails);
      }
    }
  };

  const handleScheduleChange = (index: number, field: string, value: string) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value } as { day: string; time: string };
    setSchedule(newSchedule);
  };

  const addScheduleItem = () => {
    setSchedule([...schedule, { day: "Monday", time: "10:00 AM" }]);
  };

  const removeScheduleItem = (index: number) => {
    if (schedule.length > 1) {
      setSchedule(schedule.filter((_, i) => i !== index));
    }
  };

  const handleCourseDetailChange = (day: string, value: string) => {
    setCourseDetails({
      ...courseDetails,
      [day]: value,
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

  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setBannerImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (bannerImage) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Content = base64String.split(",")[1]; // Remove the data URL prefix
        if (!base64Content) return;

        uploadImage.mutate({
          bucketName: "dc-public-files",
          fileName: `workshop-banner-${Date.now()}`,
          fileType: bannerImage.type,
          fileContent: base64Content,
          folderName: "dc-ws-banner-image",
        });
      };
      reader.readAsDataURL(bannerImage);
      return;
    }

    // Filter out empty learning outcomes
    const filteredOutcomes = form.learningOutcomes.filter(
      (outcome) => outcome.trim() !== ""
    );

    if (filteredOutcomes.length === 0) {
      toast.error("Please add at least one learning outcome");
      return;
    }

    try {
      await updateWorkshop.mutateAsync({
        id: workshop.id,
        name: form.name,
        description: form.description,
        numberOfDays: form.numberOfDays,
        schedule: schedule,
        price: form.price * 100, // Convert to paise
        learningOutcomes: filteredOutcomes,
        courseDetails: courseDetails,
        otherDetails: form.otherDetails,
      });
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const times = [
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
  ];

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
                {schedule.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Select
                      value={item.day}
                      onValueChange={(value) =>
                        handleScheduleChange(index, "day", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={item.time}
                      onValueChange={(value) =>
                        handleScheduleChange(index, "time", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {times.map((time) => (
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
                      onClick={() => removeScheduleItem(index)}
                      disabled={schedule.length <= 1}
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
                  onClick={addScheduleItem}
                  className="mt-2 w-full sm:w-auto transition-all hover:bg-primary/5"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Schedule
                </Button>
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
              disabled={updateWorkshop.isPending}
              className="w-full sm:w-auto transition-all bg-primary hover:bg-primary/90">
              {updateWorkshop.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
