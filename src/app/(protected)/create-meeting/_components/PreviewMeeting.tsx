import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Clock, MapPin } from "lucide-react";
import React, { useEffect, useState } from "react";
import { api } from "@/trpc/react";

type FormValue = {
  eventName: String;
  duration: Number;
  email: String;
  description: String;
};

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

function PreviewMeeting({ formValue }: { formValue: FormValue }) {
  const [date, setDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [availabilityData, setAvailabilityData] = useState<{
    daysAvailable: DaysAvailableType;
    bufferTime: number;
  } | null>(null);

  // Fetch mentor's availability
  const { data: mentorAvailability, isLoading } =
    api.availability.getAvailability.useQuery(undefined, {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });

  useEffect(() => {
    if (mentorAvailability) {
      setAvailabilityData({
        daysAvailable: mentorAvailability.daysAvailable as DaysAvailableType,
        bufferTime: mentorAvailability.bufferTime,
      });
    }
  }, [mentorAvailability]);

  useEffect(() => {
    if (formValue?.duration && availabilityData) {
      generateAvailableTimeSlots(date, formValue.duration, availabilityData);
    }
  }, [formValue, date, availabilityData]);

  const generateAvailableTimeSlots = (
    selectedDate: Date,
    meetingDuration: Number,
    availability: { daysAvailable: DaysAvailableType; bufferTime: number },
  ) => {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayName = dayNames[selectedDate.getDay()];
    const dayAvailability =
      availability.daysAvailable[dayName as keyof DaysAvailableType];

    // If the day is not enabled or has no time slots, return empty array
    if (!dayAvailability?.enabled || !dayAvailability?.timeSlots?.length) {
      setTimeSlots([]);
      return;
    }

    const durationInMinutes = Number(meetingDuration);
    const bufferTimeInMinutes = availability.bufferTime;
    const totalSlotDuration = durationInMinutes + bufferTimeInMinutes;
    const availableSlots: string[] = [];

    dayAvailability.timeSlots.forEach((slot) => {
      // Convert start and end times to minutes since midnight
      const [startHour, startMinute] = slot.startTime
        .split(":")
        .map(Number) || [0, 0];
      const [endHour, endMinute] = slot.endTime.split(":").map(Number) || [
        0, 0,
      ];

      const startTimeInMinutes = (startHour || 0) * 60 + (startMinute || 0);
      const endTimeInMinutes = (endHour || 0) * 60 + (endMinute || 0);

      // Calculate all possible meeting start times within this slot
      for (
        let slotStart = startTimeInMinutes;
        slotStart + durationInMinutes <= endTimeInMinutes;
        slotStart += totalSlotDuration
      ) {
        const hours = Math.floor(slotStart / 60);
        const minutes = slotStart % 60;

        const formattedHours =
          hours > 12 ? hours - 12 : hours === 0 ? 12 : hours; // Convert to 12-hour format
        const period = hours >= 12 ? "PM" : "AM";

        availableSlots.push(
          `${String(formattedHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`,
        );
      }
    });

    setTimeSlots(availableSlots);
  };


  return (
    <div className="relative m-2 flex min-h-[90vh] flex-col border-t-8 p-3 py-6 shadow-lg md:m-5 md:min-h-0 md:p-5 md:py-10">
      <div className="flex items-center text-xl font-bold md:text-2xl">
        <img src="/logo.png" alt="logo" className="w- h-[60px]" />
      </div>
      <div className="mt-3 flex flex-col gap-6 md:mt-5 md:grid md:grid-cols-3 md:gap-0">
        {/* Meeting Info  */}
        <div className="h-full p-2 md:border-r md:p-4">
          <h2 className="truncate text-2xl font-bold md:text-3xl">
            {formValue?.eventName ? formValue?.eventName : "Meeting Name"}
          </h2>
          <div className="mt-3 flex flex-col gap-3 md:mt-5 md:gap-4">
            <h2 className="flex items-center gap-2">
              <Clock size={18} />
              {formValue?.duration.toString()} Min
            </h2>
            <h2 className="flex items-center gap-2">
              <MapPin size={18} />
              <div className="text-primary">Google Meet</div>
            </h2>
          </div>
          {formValue?.description && (
            <h2 className="mt-3 font-bold md:mt-5">Description</h2>
          )}
          <div
            className="max-h-[150px] overflow-auto break-words text-primary md:max-h-none"
            style={{
              maxWidth: "100%",
              wordWrap: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            {formValue?.description}
          </div>
        </div>

        {/* Time & Date Selection  */}
        <div className="flex flex-col px-2 md:col-span-2 md:flex-row md:px-4">
          <div className="flex w-full flex-col md:w-auto">
            <h2 className="mb-2 text-lg font-bold">Select Date & Time</h2>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(day) => day && setDate(day)}
              className="mt-2 self-center rounded-md border md:mt-5 md:self-start"
              disabled={(date: Date) => {
                // Disable dates in the past
                if (date <= new Date()) return true;

                // Disable days that don't have availability
                if (availabilityData) {
                  const dayNames = [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ];
                  const dayName = dayNames[date.getDay()];
                  const dayAvailability =
                    availabilityData.daysAvailable[
                      dayName as keyof DaysAvailableType
                    ];

                  return (
                    !dayAvailability?.enabled ||
                    !dayAvailability?.timeSlots?.length
                  );
                }

                return false;
              }}
            />
          </div>
          <div className="mt-4 flex w-full flex-col md:mt-0">
            <h2 className="mb-2 text-lg font-bold md:hidden">Select Time</h2>
            {timeSlots.length > 0 ? (
              <div
                className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:ml-4 md:flex md:flex-col md:gap-4 md:overflow-auto md:p-5 md:pl-0 md:pr-0"
                style={{ maxHeight: "400px" }}
              >
                {timeSlots?.map((time, index) => (
                  <button
                    key={index}
                    className={`rounded-md border border-primary px-4 py-2 text-sm font-medium transition-colors ${
                      selectedTimeSlot === time
                        ? "bg-primary text-white"
                        : "bg-transparent text-primary"
                    }`}
                  
                  >
                    {time}
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-2 flex items-center justify-center p-4 text-center text-gray-500 md:ml-4 md:h-full md:border">
                {isLoading
                  ? "Loading availability..."
                  : "No available time slots for this day. Please select another day."}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spacer for mobile to push content up from fixed button */}
      {selectedTimeSlot && <div className="pb-20 md:mt-4 md:pb-0"></div>}

      
    </div>
  );
}

export default PreviewMeeting;
