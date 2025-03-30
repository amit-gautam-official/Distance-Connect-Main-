import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import React from "react";

interface TimeDateSelectionProps {
  date: Date;
  handleDateChange: (date: Date) => void;
  timeSlots: string[];
  setSelectedTime: (time: string) => void;
  enableTimeSlot: boolean;
  selectedTime: string;
  prevBooking: { selectedTime: string }[];
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
  /**
   * Used to check timeslot whether its already booked or not
   * @param {*} time
   * @returns Boolean
   */
  const checkTimeSlot = (time: string) => {
    return prevBooking.filter((item) => item.selectedTime === time).length > 0;
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
