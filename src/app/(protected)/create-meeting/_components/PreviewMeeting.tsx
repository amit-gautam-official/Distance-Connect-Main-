import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Clock, MapPin } from "lucide-react";
import React, { useEffect, useState } from "react";

type FormValue = {
  eventName: String;
  duration: Number;
  email: String;
  description: String;
};

function PreviewMeeting({ formValue }: { formValue: FormValue }) {
  const [date, setDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  useEffect(() => {
    formValue?.duration && createTimeSlot(formValue?.duration);
  }, [formValue]);

  const createTimeSlot = (interval: any) => {
    const startTime = 8 * 60; // 8 AM in minutes
    const endTime = 22 * 60; // 10 PM in minutes
    const totalSlots = (endTime - startTime) / interval;
    const slots = Array.from({ length: totalSlots }, (_, i) => {
      const totalMinutes = startTime + i * interval;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const formattedHours = hours > 12 ? hours - 12 : hours; // Convert to 12-hour format
      const period = hours >= 12 ? "PM" : "AM";
      return `${String(formattedHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
    });

    setTimeSlots(slots);
  };

  const handleTimeSlotSelect = (time: string) => {
    setSelectedTimeSlot(time);
  };

  return (
    <div className="relative m-2 flex min-h-[90vh] flex-col border-t-8 p-3 py-6 shadow-lg md:m-5 md:min-h-0 md:p-5 md:py-10">
      <div className="flex items-center text-xl font-bold md:text-2xl">
        Distance Connect
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
              disabled={(date: Date) => date <= new Date()}
            />
          </div>
          <div className="mt-4 flex w-full flex-col md:mt-0">
            <h2 className="mb-2 text-lg font-bold md:hidden">Select Time</h2>
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
                  onClick={() => handleTimeSlotSelect(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for mobile to push content up from fixed button */}
      {selectedTimeSlot && <div className="pb-20 md:mt-4 md:pb-0"></div>}

      {/* Confirm Button */}
      {selectedTimeSlot && (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 shadow-lg md:static md:mt-6 md:flex md:justify-end md:border-0 md:bg-transparent md:p-0 md:shadow-none">
          <Button className="w-full bg-primary hover:bg-primary/90 md:w-auto">
            Confirm {selectedTimeSlot}
          </Button>
        </div>
      )}
    </div>
  );
}

export default PreviewMeeting;
