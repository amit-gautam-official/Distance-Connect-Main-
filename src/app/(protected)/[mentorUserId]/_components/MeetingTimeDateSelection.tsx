"use client";
import { Button } from "@/components/ui/button";
import { format, isValid } from "date-fns";
import { CalendarCheck, Clock, LoaderIcon, MapPin, Timer } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import TimeDateSelection from "./TimeDateSelection";
import UserFormInfo from "./UserFormInfo";
import { useRouter } from "next/navigation";
import { JSONValue } from "node_modules/superjson/dist/types";
import { api } from "@/trpc/react";
import { Resend } from "resend";
import { render } from "@react-email/render";
import Email from "@/../emails/index";
import { toast } from "sonner";
import { useUser } from "@auth0/nextjs-auth0";

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

type EventInfo = {
  id: string;
  eventName: string;
  duration: number;
  description: string | null;
  meetEmail: string | null;
};

type MentorUserDetails = {
  name: string | null;
  email: string;
  daysAvailable: JSONValue;
  mentorUserId: string;
  bufferTime?: number;
};

type ScheduledMeeting = {
  selectedTime: string;
  userNote: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  duration: number;
  meetUrl: string;
  mentorUserId: string;
  selectedDate: Date;
  formatedDate: string;
  formatedTimeStamp: string;
  eventId: string;
  studentUserId: string;
};

function MeetingTimeDateSelection({
  eventInfo,
  mentorUserDetails,
}: {
  eventInfo: EventInfo;
  mentorUserDetails: MentorUserDetails;
}) {
  const [date, setDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [enableTimeSlot, setEnabledTimeSlot] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<string>();
  const [userNote, setUserNote] = useState<string>("");
  const [prevBooking, setPrevBooking] = useState<ScheduledMeeting[]>([]);
  const [meetUrl, setMeetUrl] = useState<string>("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user, error, isLoading } = useUser();
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [step, setStep] = useState<number>(1);
  const [mentorAvailability, setMentorAvailability] = useState<{
    daysAvailable: DaysAvailableType;
    bufferTime: number;
  }>();

  const { data: prevBookingData } =
    api.scheduledMeetings.getScheduledMeetingsList.useQuery(
      {
        selectedDate: date,
        eventId: eventInfo.id,
      },
      {
        // Reduce retries to avoid rate limit issues
        retry: 1,
        // Increase staleTime to reduce refetches
        staleTime: 1 * 60 * 1000, // 1 minute
        // Only run the query when we have a valid date
        enabled: !!date,
      },
    );

  const sendEmaill = api.email.sendEmail.useMutation({
    onSuccess: () => {
      //console.log('Email Sent!');
    },
    onError: (error) => {
      //console.log(error);
    },
  });

  useEffect(() => {
    if (prevBookingData) {
      setPrevBooking(prevBookingData!);
    }
  }, [prevBookingData]);

  useEffect(() => {
    // Extract and sanitize mentor availability data
    if (mentorUserDetails.daysAvailable) {
      try {
        const parsedAvailability = {
          daysAvailable: mentorUserDetails.daysAvailable as DaysAvailableType,
          bufferTime: mentorUserDetails.bufferTime || 15, // Default 15 min buffer if not specified
        };
        setMentorAvailability(parsedAvailability);

        // Generate time slots for the current date
        if (eventInfo?.duration) {
          generateAvailableTimeSlots(
            date,
            eventInfo.duration,
            parsedAvailability,
          );
        }
      } catch (e) {
        console.error("Error parsing mentor availability:", e);
      }
    }
  }, [mentorUserDetails, eventInfo, date]);

  const meetlinkGenerator = api.meet.generateMeetLink.useMutation({
    onSuccess: (data) => {
      //console.log('Meeting Link Generated');
      //   toast('Meeting Link Generated');
      //   //console.log(data);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Generate time slots based on mentor's availability for the selected day
  const generateAvailableTimeSlots = (
    selectedDate: Date,
    meetingDuration: number,
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
      setEnabledTimeSlot(false);
      return;
    }

    setEnabledTimeSlot(true);

    const durationInMinutes = Number(meetingDuration);
    const bufferTimeInMinutes = availability.bufferTime;
    const totalSlotDuration = durationInMinutes + bufferTimeInMinutes;
    const availableSlots: string[] = [];

    dayAvailability.timeSlots.forEach((slot) => {
      // Convert start and end times to minutes since midnight
      const [startHour, startMinute] = slot?.startTime
        ?.split(":")
        ?.map(Number) || [0, 0];
      const [endHour, endMinute] = slot?.endTime?.split(":")?.map(Number) || [
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

        // Format in 12-hour format with AM/PM
        const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
        const period = hours >= 12 ? "PM" : "AM";

        availableSlots.push(
          `${String(formattedHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`,
        );
      }
    });

    setTimeSlots(availableSlots);
  };

  /**
   * On Date Change Handle Method
   * @param {*} date
   */
  const handleDateChange = (date: Date) => {
    if (!isValid(date)) {
      return;
    }
    setDate(date);

    if (mentorAvailability && eventInfo?.duration) {
      generateAvailableTimeSlots(date, eventInfo.duration, mentorAvailability);
    }
  };

  const getCombinedTimestamp = (date: Date, time: string) => {
    //console.log(date)
    //console.log("-----------------")
    //console.log(time)
    const [hours, minutesPart] = time.split(":");
    const minutes = minutesPart ? parseInt(minutesPart.slice(0, 2), 10) : 0;
    const isPM = time.toLowerCase().includes("pm");

    // Adjust hours for AM/PM
    const adjustedHours = isPM
      ? hours === "12"
        ? 12
        : parseInt(hours ?? "0", 10) + 12
      : hours === "12"
        ? 0
        : parseInt(hours ?? "0", 10);

    // Set the hours and minutes into the Date object
    const updatedDate = new Date(date);
    updatedDate.setHours(adjustedHours, minutes, 0, 0);

    return updatedDate.getTime(); // Returns a timestamp in milliseconds
  };

  function convertToDateTime(date: Date, time: string): Date {
    const year = date.getFullYear();
    const month = date.getMonth(); // Month is 0-based
    const day = date.getDate();

    // Extract time components from the "hh:mm AM/PM" format
    const [timePart, modifier] = time.split(" ");
    let [hours = 0, minutes = 0] = timePart?.split(":").map(Number) ?? [0, 0];

    // Convert 12-hour format to 24-hour format
    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    // Create new Date object with the specified date and time
    return new Date(year, month, day, hours, minutes);
  }

  const handleScheduleEvent = async () => {
    // Validate email is a Gmail address
    if (!userEmail.toLowerCase().endsWith("@gmail.com")) {
      toast.error("Please provide a valid Gmail address for Google Meet");
      return;
    }

    // Check if name is provided
    if (!userName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setLoading(true);
    try {
      const { meetLink } = await meetlinkGenerator.mutateAsync({
        dateTime: convertToDateTime(date, selectedTime!).toString(),
        duration: eventInfo.duration,
        attendees: [{ email: eventInfo.meetEmail! }, { email: userEmail }],
      });

      if (!meetLink) {
        toast.error("Error in generating meeting link");
        setLoading(false);
        return;
      }

      setMeetUrl(meetLink);
      await createScheduledMeeting.mutateAsync({
        mentorUserId: mentorUserDetails.mentorUserId,
        selectedTime: selectedTime ?? "",
        selectedDate: date,
        formatedDate: format(date, "PPP"),
        formatedTimeStamp: getCombinedTimestamp(date, selectedTime!).toString(),
        duration: eventInfo.duration,
        meetUrl: meetLink,
        eventId: eventInfo.id,
        userNote: userNote,
        eventName: eventInfo.eventName,
      });
    } catch (error) {
      console.error(error);
      toast.error("Error scheduling meeting. Please try again later.");
      setLoading(false);
    }
  };

  const createScheduledMeeting =
    api.scheduledMeetings.createScheduledMeeting.useMutation({
      onSuccess: async () => {
        //console.log('Meeting Scheduled successfully!')
        setLoading(false);
        router.push("/confirmation");
      },
      onError: (error) => {
        setLoading(false);
        toast.error("Failed to schedule meeting. Please try again.");
      },
    });

  return (
    <div className="rounded-lg border bg-white shadow-md">
      <div className="border-b p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {eventInfo.eventName}
            </h1>
            <p className="mt-2 flex items-center text-gray-700">
              <Clock className="mr-1 h-4 w-4" />
              {eventInfo.duration} minutes
            </p>
          </div>
          <div className="ml-4 p-3">
          <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={50}
            className="h-auto"
            priority
          />
          </div>
        </div>
        {eventInfo.description && (
          <div className="mt-4">
            <h2 className="font-medium text-gray-900">About</h2>
            <p className="mt-1 text-gray-700">{eventInfo.description}</p>
          </div>
        )}
      </div>

      {step === 1 ? (
        <div className="p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Select Date and Time
          </h2>
          <TimeDateSelection
            date={date}
            handleDateChange={handleDateChange}
            timeSlots={timeSlots}
            setSelectedTime={setSelectedTime}
            enableTimeSlot={enableTimeSlot}
            selectedTime={selectedTime!}
            prevBooking={prevBooking}
          />
          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => selectedTime && setStep(2)}
              disabled={!selectedTime}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Next
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="mb-4 flex items-center">
            <Button
              variant="ghost"
              onClick={() => setStep(1)}
              className="mr-4 h-8 w-8 p-0"
            >
              <span className="sr-only">Back</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </Button>
            <h2 className="text-xl font-bold text-gray-900">Your Details</h2>
          </div>

          <div className="rounded-md bg-gray-50 p-4">
            <div className="mb-2 flex items-center">
              <CalendarCheck className="mr-2 h-4 w-4 text-primary" />
              <span className="font-medium">
                {format(date, "EEEE, MMMM d")}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-primary" />
              <span>{selectedTime}</span>
            </div>
          </div>

          <UserFormInfo
            setUserEmail={setUserEmail}
            setUserName={setUserName}
            setUserNote={setUserNote}
          />

          <div className="mt-6">
            <Button
              onClick={handleScheduleEvent}
              className="w-full bg-primary text-white hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Schedule Meeting"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MeetingTimeDateSelection;
