"use client";

import React, { useEffect, useState } from "react";
import DaysList from "@/lib/DaysList";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function AvailabilitySettings() {
  type DaysAvailable = {
    Sunday: boolean;
    Monday: boolean;
    Tuesday: boolean;
    Wednesday: boolean;
    Thursday: boolean;
    Friday: boolean;
    Saturday: boolean;
  };

  const [daysAvailable, setDaysAvailable] = useState<DaysAvailable>({
    Sunday: false,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
  });
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
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
      setStartTime(availabilityData.startTime || "");
      setEndTime(availabilityData.endTime || "");
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

  const onHandleChange = (day: string, value: string | boolean) => {
    setDaysAvailable({
      ...daysAvailable,
      [day]: value,
    });
  };

  const handleSave = async () => {
    if (!startTime || !endTime) {
      toast.error("Missing time selection", {
        description: "Please select both start and end times.",
        duration: 3000,
      });
      return;
    }

    // Check if at least one day is selected
    const hasSelectedDays = Object.values(daysAvailable).some((day) => day);
    if (!hasSelectedDays) {
      toast.error("No days selected", {
        description: "Please select at least one day of availability.",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createAndUpdateAvailability.mutateAsync({
        daysAvailable: daysAvailable,
        startTime: startTime,
        endTime: endTime,
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
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Available Days</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {DaysList.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`day-${index}`}
                  checked={
                    daysAvailable[item?.day as keyof DaysAvailable] ?? false
                  }
                  onCheckedChange={(e) => onHandleChange(item.day, e)}
                />
                <label
                  htmlFor={`day-${index}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {item.day}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Available Hours</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="start-time" className="text-sm font-medium">
                Start Time
              </label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="end-time" className="text-sm font-medium">
                End Time
              </label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>

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
