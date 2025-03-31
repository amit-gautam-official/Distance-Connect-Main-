import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JSONValue } from "node_modules/superjson/dist/types";
import { Clock } from "lucide-react";

// Types for the new availability structure
type TimeSlot = {
  startTime: string;
  endTime: string;
};

type DayAvailability = {
  enabled: boolean;
  timeSlots: TimeSlot[];
};

type DaysAvailableType = {
  Sunday: DayAvailability;
  Monday: DayAvailability;
  Tuesday: DayAvailability;
  Wednesday: DayAvailability;
  Thursday: DayAvailability;
  Friday: DayAvailability;
  Saturday: DayAvailability;
};

interface AvailabilityCardProps {
  availability: {
    timezone: string;
    availableDays: string[];
    availableHours: string;
    nextAvailable: string;
  };
  avail: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    mentorUserId: string;
    daysAvailable: JSONValue;
    bufferTime: number;
  };
}

// Helper function to format time for display
const formatTime = (timeString: string) => {
  if (!timeString) return "";

  try {
    const [hours = "", minutes = ""] = timeString.split(":");
    const hoursNum = parseInt(hours, 10);
    const period = hoursNum >= 12 ? "PM" : "AM";
    const formattedHours =
      hoursNum > 12 ? hoursNum - 12 : hoursNum === 0 ? 12 : hoursNum;

    return `${formattedHours}:${minutes} ${period}`;
  } catch (error) {
    return timeString;
  }
};

export function AvailabilityCard({
  availability,
  avail,
}: AvailabilityCardProps) {
  console.log("avail", avail);

  // Parse daysAvailable
  const daysAvailable = avail?.daysAvailable as DaysAvailableType;

  // Get days that are enabled
  const enabledDays = daysAvailable
    ? Object.entries(daysAvailable)
        .filter(
          ([_, dayData]) => dayData.enabled && dayData.timeSlots.length > 0,
        )
        .map(([day]) => day)
    : [];

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Availability</h2>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-2 text-sm font-medium text-gray-500">Timezone</h3>
          <p className="text-gray-800">{availability.timezone}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-2 text-sm font-medium text-gray-500">
            Available Days
          </h3>
          <p className="text-gray-800">
            {enabledDays.length > 0
              ? enabledDays.join(", ")
              : "No availability set"}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-2 text-sm font-medium text-gray-500">
            Buffer Time
          </h3>
          <p className="text-gray-800">{avail?.bufferTime || 0} minutes</p>
        </div>
      </div>

      {/* Detailed daily availability */}
      {daysAvailable && enabledDays.length > 0 && (
        <div className="mt-4 space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Daily Schedule</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(daysAvailable).map(([day, dayData]) => {
              if (!dayData.enabled || dayData.timeSlots.length === 0)
                return null;

              return (
                <div key={day} className="rounded-lg border p-4">
                  <h4 className="mb-2 font-medium text-gray-900">{day}</h4>
                  <div className="space-y-2">
                    {dayData.timeSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="flex items-center text-sm text-gray-700"
                      >
                        <Clock className="mr-2 h-4 w-4 text-gray-400" />
                        {formatTime(slot.startTime)} -{" "}
                        {formatTime(slot.endTime)}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
