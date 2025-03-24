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
    setLoading(true);
    const { meetLink } = await meetlinkGenerator.mutateAsync({
      dateTime: convertToDateTime(date, selectedTime!).toString(),
      duration: eventInfo.duration,
      attendees: [{ email: eventInfo.meetEmail! }, { email: userEmail }],
    });

    if (!meetLink) {
      toast.error("Error in generating meeting link");
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
    <div className="md:mx-26 m-5 mx-10 my-10 border-t-8 p-5 py-10 shadow-lg lg:mx-56">
      <Image src="/logo.svg" alt="logo" width={150} height={150} />
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3">
        {/* Meeting Info  */}
        <div className="border-r p-4">
          <h2>{mentorUserDetails?.name}</h2>
          <h2 className="text-3xl font-bold">
            {eventInfo?.eventName ? eventInfo?.eventName : "Meeting Name"}
          </h2>
          <div className="mt-5 flex flex-col gap-4">
            <h2 className="flex gap-2">
              <Clock />
              {eventInfo?.duration} Min{" "}
            </h2>
            <h2 className="flex gap-2">
              <MapPin />
              <div className="text-primary">{"Google Meet"}</div>{" "}
            </h2>
            <h2 className="flex gap-2">
              <CalendarCheck />
              {format(date, "PPP")}{" "}
            </h2>
            {selectedTime && (
              <h2 className="flex gap-2">
                <Timer />
                {selectedTime}{" "}
              </h2>
            )}
          </div>
        </div>
        {/* Time & Date Selction  */}
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
      <div className="flex justify-end gap-3">
        {step === 1 ? (
          <Button onClick={() => setStep(2)}>
            {loading ? <LoaderIcon className="animate-spin" /> : "Next"}
          </Button>
        ) : (
          <Button onClick={handleScheduleEvent}>
            {loading ? <LoaderIcon className="animate-spin" /> : "Schedule"}
          </Button>
        )}
      </div>
    </div>
  );
}

export default MeetingTimeDateSelection;
