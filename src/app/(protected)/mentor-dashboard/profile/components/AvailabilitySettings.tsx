"use client";

import React, { useEffect, useState } from "react";
import DaysList from "@/lib/DaysList";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define types for our new availability structure
type TimeSlot = {
  startTime: string;
  endTime: string;
};

type DayAvailability = {
  enabled: boolean;
  timeSlots: TimeSlot[];
};

type DaysAvailable = {
  Sunday: DayAvailability;
  Monday: DayAvailability;
  Tuesday: DayAvailability;
  Wednesday: DayAvailability;
  Thursday: DayAvailability;
  Friday: DayAvailability;
  Saturday: DayAvailability;
};

function AvailabilitySettings() {
  // Initial state with empty time slots for each day
  const [daysAvailable, setDaysAvailable] = useState<DaysAvailable>({
    Sunday: { enabled: false, timeSlots: [] },
    Monday: { enabled: false, timeSlots: [] },
    Tuesday: { enabled: false, timeSlots: [] },
    Wednesday: { enabled: false, timeSlots: [] },
    Thursday: { enabled: false, timeSlots: [] },
    Friday: { enabled: false, timeSlots: [] },
    Saturday: { enabled: false, timeSlots: [] },
  });

  const [bufferTime, setBufferTime] = useState<number>(15);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Query to fetch existing availability data
  const { data: availabilityData, isLoading } =
    api.availability.getAvailability.useQuery(undefined, {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });

  // Update form data when availability data is fetched
  useEffect(() => {
    if (availabilityData) {
      setDaysAvailable(availabilityData.daysAvailable as DaysAvailable);
      setBufferTime(availabilityData.bufferTime);
    }
  }, [availabilityData]);

  const createAndUpdateAvailability =
    api.availability.createAndUpdateAvailability.useMutation({
      onSuccess: () => {
        toast.success("Availability updated successfully!", {
          description: "Your availability settings have been saved.",
          duration: 3000,
        });
        setIsSubmitting(false);
      },
      onError: (error) => {
        toast.error("Failed to update availability", {
          description: error.message || "Please try again later.",
          duration: 4000,
        });
        setIsSubmitting(false);
      },
    });

  // Handle day checkbox change
  const handleDayToggle = (day: keyof DaysAvailable, enabled: boolean) => {
    setDaysAvailable({
      ...daysAvailable,
      [day]: {
        ...daysAvailable[day],
        enabled,
      },
    });
  };

  // Add a new time slot to a specific day
  const addTimeSlot = (day: keyof DaysAvailable) => {
    setDaysAvailable({
      ...daysAvailable,
      [day]: {
        ...daysAvailable[day],
        timeSlots: [
          ...daysAvailable[day].timeSlots,
          { startTime: "09:00", endTime: "17:00" },
        ],
      },
    });
  };

  // Remove a time slot from a specific day
  const removeTimeSlot = (day: keyof DaysAvailable, index: number) => {
    setDaysAvailable({
      ...daysAvailable,
      [day]: {
        ...daysAvailable[day],
        timeSlots: daysAvailable[day].timeSlots.filter((_, i) => i !== index),
      },
    });
  };

  // Update a time slot for a specific day
  const updateTimeSlot = (
    day: keyof DaysAvailable,
    index: number,
    field: keyof TimeSlot,
    value: string,
  ) => {
    const updatedTimeSlots = [...daysAvailable[day].timeSlots];
    updatedTimeSlots[index] = {
      startTime: updatedTimeSlots[index]?.startTime || "",
      endTime: updatedTimeSlots[index]?.endTime || "",
      ...updatedTimeSlots[index],
      [field]: value,
    };

    setDaysAvailable({
      ...daysAvailable,
      [day]: {
        ...daysAvailable[day],
        timeSlots: updatedTimeSlots,
      },
    });
  };

  const handleSave = async () => {
    // Check if there's at least one day with time slots
    const hasAvailability = Object.values(daysAvailable).some(
      (day) => day.enabled && day.timeSlots.length > 0,
    );

    if (!hasAvailability) {
      toast.error("Missing availability", {
        description: "Please add at least one time slot for an enabled day.",
        duration: 3000,
      });
      return;
    }

    // Validate that all time slots have valid start and end times
    let hasInvalidTimeSlots = false;
    Object.entries(daysAvailable).forEach(([day, dayData]) => {
      if (dayData.enabled) {
        dayData.timeSlots.forEach((slot) => {
          if (
            !slot.startTime ||
            !slot.endTime ||
            slot.startTime >= slot.endTime
          ) {
            hasInvalidTimeSlots = true;
          }
        });
      }
    });

    if (hasInvalidTimeSlots) {
      toast.error("Invalid time slots", {
        description:
          "Please ensure all time slots have valid start and end times.",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createAndUpdateAvailability.mutateAsync({
        daysAvailable,
        bufferTime,
      });
    } catch (error) {
      // Error is handled by the mutation's onError callback
      console.error("Error saving availability:", error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Availability Settings</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="buffer-time">
            Buffer Time Between Meetings (minutes)
          </Label>
          <Select
            value={bufferTime.toString()}
            onValueChange={(value) => setBufferTime(parseInt(value))}
          >
            <SelectTrigger id="buffer-time" className="w-full sm:w-40">
              <SelectValue placeholder="Select buffer time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">No buffer</SelectItem>
              <SelectItem value="5">5 minutes</SelectItem>
              <SelectItem value="10">10 minutes</SelectItem>
              <SelectItem value="15">15 minutes</SelectItem>
              <SelectItem value="20">20 minutes</SelectItem>
              <SelectItem value="30">30 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {DaysList.map((item, index) => {
          const day = item.day as keyof DaysAvailable;
          const dayData = daysAvailable[day];

          return (
            <div key={index} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${index}`}
                    checked={dayData.enabled}
                    onCheckedChange={(checked) =>
                      handleDayToggle(day, checked === true)
                    }
                  />
                  <label
                    htmlFor={`day-${index}`}
                    className="text-lg font-medium"
                  >
                    {day}
                  </label>
                </div>

                {dayData.enabled && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addTimeSlot(day)}
                    className="ml-auto"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Time Slot
                  </Button>
                )}
              </div>

              {dayData.enabled && dayData.timeSlots.length > 0 && (
                <div className="mt-4 space-y-3">
                  {dayData.timeSlots.map((slot, slotIndex) => (
                    <div
                      key={slotIndex}
                      className="grid grid-cols-1 gap-4 rounded-md border p-3 sm:grid-cols-3"
                    >
                      <div className="space-y-1">
                        <Label htmlFor={`${day}-start-${slotIndex}`}>
                          Start Time
                        </Label>
                        <Input
                          id={`${day}-start-${slotIndex}`}
                          type="time"
                          value={slot.startTime}
                          onChange={(e) =>
                            updateTimeSlot(
                              day,
                              slotIndex,
                              "startTime",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`${day}-end-${slotIndex}`}>
                          End Time
                        </Label>
                        <Input
                          id={`${day}-end-${slotIndex}`}
                          type="time"
                          value={slot.endTime}
                          onChange={(e) =>
                            updateTimeSlot(
                              day,
                              slotIndex,
                              "endTime",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="flex items-end space-x-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeTimeSlot(day, slotIndex)}
                          className="w-full"
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {dayData.enabled && dayData.timeSlots.length === 0 && (
                <div className="mt-4 rounded-md bg-gray-50 p-4 text-center text-sm text-gray-500">
                  No time slots added. Click &quot;Add Time Slot&quot; to set
                  availability for {day}.
                </div>
              )}
            </div>
          );
        })}

        <Button
          onClick={handleSave}
          className="w-full sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Availability"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default AvailabilitySettings;
