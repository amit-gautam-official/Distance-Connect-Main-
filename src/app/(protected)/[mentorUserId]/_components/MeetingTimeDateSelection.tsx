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
    eventInfo?.duration && createTimeSlot(eventInfo?.duration);
  }, [eventInfo]);

  const createScheduledMeeting =
    api.scheduledMeetings.createScheduledMeeting.useMutation({
      onSuccess: async () => {
        //console.log('Meeting Scheduled successfully!')
        await sendEmail();
        setLoading(false);
        router.push("/confirmation");
      },
      onError: (error) => {
        //console.log(error)
      },
    });

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

  const createTimeSlot = (interval: number) => {
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

    // //console.log(slots)
    setTimeSlots(slots);
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
    const day = format(date, "EEEE");

    if ((mentorUserDetails?.daysAvailable as Record<string, any>)?.[day]) {
      setEnabledTimeSlot(true);
    } else {
      setEnabledTimeSlot(false);
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
      setLoading(false);
      toast.error("Failed to schedule meeting. Please try again.");
    }
  };

  /**
   * Used to Send an email to User
   * @param {*} user
   */
  const sendEmail = async () => {
    if (
      mentorUserDetails.name &&
      date &&
      eventInfo.duration &&
      selectedTime &&
      meetUrl &&
      mentorUserDetails.email
    ) {
      sendEmaill.mutateAsync({
        date: format(date, "PPP").toString(),
        mentorName: mentorUserDetails?.name,
        duration: eventInfo?.duration.toString(),
        meetingTime: selectedTime,
        meetingUrl: meetUrl,
      });
    } else {
      alert("Email not sent");
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl rounded-lg border-t-4 border-primary p-4 py-6 shadow-lg sm:p-5 sm:py-8 md:p-6 md:py-10">
      <div className="mb-6 flex items-center justify-between">
        <Image
          src="/logo.svg"
          alt="logo"
          width={120}
          height={40}
          className="h-auto"
        />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Meeting Info  */}
        <div className="rounded-lg bg-gray-50 p-4 md:border-r md:bg-transparent">
          <h2 className="text-lg font-medium text-gray-700">
            {mentorUserDetails?.name}
          </h2>
          <h2 className="mb-4 text-2xl font-bold text-primary sm:text-3xl">
            {eventInfo?.eventName ? eventInfo?.eventName : "Meeting Name"}
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <span>{eventInfo?.duration} Min</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div className="text-primary">{"Google Meet"}</div>
            </div>
            <div className="flex items-center gap-3">
              <CalendarCheck className="h-5 w-5 text-primary" />
              <span>{format(date, "PPP")}</span>
            </div>
            {selectedTime && (
              <div className="flex items-center gap-3">
                <Timer className="h-5 w-5 text-primary" />
                <span>{selectedTime}</span>
              </div>
            )}
          </div>
        </div>
        {/* Time & Date Selection  */}
        <div className="md:col-span-2">
          {step === 1 ? (
            <TimeDateSelection
              date={date}
              enableTimeSlot={enableTimeSlot}
              handleDateChange={handleDateChange}
              setSelectedTime={setSelectedTime}
              timeSlots={timeSlots}
              selectedTime={selectedTime!}
              prevBooking={prevBooking}
            />
          ) : (
            <UserFormInfo
              setUserEmail={setUserEmail}
              setUserName={setUserName}
              setUserNote={setUserNote}
            />
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-center gap-3 md:justify-end">
        {step === 1 ? (
          <Button
            onClick={() => setStep(2)}
            className="w-full px-6 py-2 text-sm font-medium transition-all hover:shadow-md active:scale-95 sm:w-auto"
            disabled={!selectedTime}
            aria-label="Proceed to next step"
          >
            {loading ? (
              <>
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              "Next"
            )}
          </Button>
        ) : (
          <Button
            onClick={handleScheduleEvent}
            className="w-full px-6 py-2 text-sm font-medium transition-all hover:shadow-md active:scale-95 sm:w-auto"
            aria-label="Schedule meeting"
          >
            {loading ? (
              <>
                <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              "Schedule"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

export default MeetingTimeDateSelection;
