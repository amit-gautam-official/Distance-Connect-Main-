import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import React from "react";
import { type  ScheduledMeetings } from "@prisma/client";



interface TimeDateSelectionProps {
  date: Date;
  handleDateChange: (date: Date) => void;
  timeSlots: string[];
  setSelectedTime: (time: string) => void;
  enableTimeSlot: boolean;
  selectedTime: string;
  prevBooking: ScheduledMeetings[];
}

function TimeDateSelection({
  date,
  handleDateChange,
  timeSlots,
  setSelectedTime,
  enableTimeSlot,
  selectedTime,
  prevBooking,
}: TimeDateSelectionProps) {
 
  // Converts "09:00 AM" + date to a Date object
const getDateTimeFromDateAndTime = (date: Date, time: string): Date => {
  const [hours, minutesPart] = time.split(":");

  const minutesArray = minutesPart ? minutesPart.split(" ") : ["0", "AM"];
  const [minutes, period] = minutesArray;
  let hour = parseInt(hours!);
  const minute = parseInt(minutes!);

  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  const result = new Date(date);
  result.setHours(hour, minute, 0, 0);
  return result;
};

const checkTimeSlot = (time: string) => {
  const selectedStart = getDateTimeFromDateAndTime(date, time);
  const selectedEnd = new Date(selectedStart.getTime() + 30 * 60 * 1000); // Event2 = 30 mins

  return prevBooking.some((booking) => {
    const bookingStart = getDateTimeFromDateAndTime(new Date(booking.selectedDate), booking.selectedTime);
    const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 60 * 1000);

    // Check for overlap
    const isOverlapping = selectedStart < bookingEnd && selectedEnd > bookingStart;
    return isOverlapping;
  });
};


  return (
    <div className="flex w-full flex-col gap-5 px-2 md:flex-row md:px-4">
      <div className="flex flex-col">
        <h2 className="mb-2 text-lg font-bold">Select Date</h2>
        <div className="touch-manipulation">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => handleDateChange(d!)}
            className="mx-auto mt-1 w-full max-w-[350px] rounded-md border md:mx-0"
            disabled={(date) => date < new Date()}
            initialFocus
          />
        </div>
      </div>

      <div className="mt-4 w-full md:mt-0">
        <h2 className="mb-2 text-lg font-bold">Select Time</h2>
        {!enableTimeSlot && (
          <p className="mb-2 text-sm text-amber-600" role="alert">
            Please select a date when the mentor is available
          </p>
        )}
        <div
          className="scrollbar-thin grid max-h-[350px] grid-cols-2 gap-2 overflow-y-auto p-2 sm:grid-cols-3"
          role="radiogroup"
          aria-label="Available time slots"
        >
          {timeSlots?.map((time, index) => {
            const isBooked = checkTimeSlot(time);
            const isSelected = time === selectedTime;

            return (
              <Button
                key={index}
                disabled={!enableTimeSlot || isBooked}
                onClick={() => setSelectedTime(time)}
                className={`  ${isSelected ? "bg-primary text-white" : "border-primary bg-white text-primary"} ${isBooked ? "opacity-50" : "hover:opacity-90"} h-auto min-h-[44px] py-3 px-1 text-xs transition-all active:scale-95`}
                variant="outline"
                role="radio"
                aria-checked={isSelected}
                aria-label={`Select time ${time}`}
                
              >
                {time}
                {isBooked && <span className="sr-only"> (already booked)</span>}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TimeDateSelection;
