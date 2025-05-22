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
import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  // For recurring schedule (day and time)
  const [recurringSchedule, setRecurringSchedule] = useState<RecurringScheduleItem[]>([
    { day: "Monday", time: "10:00 AM" },
  ]);
  
  // For custom schedule (specific date and time for each session)
  const [customSchedule, setCustomSchedule] = useState<CustomScheduleItem[]>([
    { date: getTodayDateString(), time: "10:00 AM" },
  ]);

  const [courseDetails, setCourseDetails] = useState<Record<string, string>>({
    "Day 1": "",
  });

  const createWorkshop = api.workshop.createWorkshop.useMutation({
    onSuccess: () => {
      resetForm();
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
    if (customSchedule.length < form.numberOfDays) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty learning outcomes
    const filteredOutcomes = form.learningOutcomes.filter(outcome => outcome.trim() !== "");
    
    if (filteredOutcomes.length === 0) {
      toast.error("Please add at least one learning outcome");
      return;
    }
    
    // Validate schedule based on type
    if (form.scheduleType === "recurring" && !form.startDate) {
      toast.error("Please select a start date for recurring schedule");
      return;
    }

    // Prepare schedule data based on schedule type
    const scheduleData = form.scheduleType === "recurring" 
      ? recurringSchedule 
      : customSchedule;

    // Create workshop
    createWorkshop.mutate({
      name: form.name,
      description: form.description,
      numberOfDays: form.numberOfDays,
      price: form.price,
      learningOutcomes: filteredOutcomes,
      otherDetails: form.otherDetails,
      scheduleType: form.scheduleType,
      startDate: form.startDate,
      schedule: scheduleData,
      courseDetails: courseDetails,
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      numberOfDays: 1,
      price: 0,
      learningOutcomes: [""],
      otherDetails: "",
      scheduleType: "recurring",
      startDate: "",
    });
    setRecurringSchedule([{ day: "Monday", time: "10:00 AM" }]);
    setCustomSchedule([{ date: getTodayDateString(), time: "10:00 AM" }]);
    setCourseDetails({ "Day 1": "" });
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numberOfDays">Number of Days</Label>
                <Input
                  id="numberOfDays"
                  name="numberOfDays"
                  type="number"
                  min={1}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                      e.preventDefault();
                    }
                  }}
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
                  onKeyDown={(e) => {
                    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                      e.preventDefault();
                    }
                  }}
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
                            {days.map((day) => (
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
                            {times.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
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
                  {customSchedule.length < form.numberOfDays && (
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
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createWorkshop.isPending}
              className="w-full sm:w-auto transition-all bg-primary hover:bg-primary/90">
              {createWorkshop.isPending ? "Creating..." : "Create Workshop"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
