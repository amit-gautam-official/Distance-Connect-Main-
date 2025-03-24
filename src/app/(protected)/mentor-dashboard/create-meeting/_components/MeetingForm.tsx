"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";

function MeetingForm({ setFormValue }: { setFormValue: Function }) {
  const [eventName, setEventName] = useState<string>();
  const [duration, setDuration] = useState<Number>(30);
  const [email, setEmail] = useState<string>("example@gmail.com");
  const [description, setDescription] = useState<string>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const createMeetingEvent = api.meetingEvent.createMeetingEvent.useMutation({
    onSuccess: () => {
      //console.log('New Meeting Event Created!');
      toast("New Meeting Event Created!");
      router.push("/mentor-dashboard/meeting/meeting-type");
      setLoading(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  //   const meetlinkGenerator = api.meet.generateMeetLink.useMutation({
  //     onSuccess: (data) => {
  //       //console.log('Meeting Link Generated');
  //     //   toast('Meeting Link Generated');
  //     //   //console.log(data);
  //     },
  //     onError: (error) => {
  //       toast.error(error.message);
  //   }
  // })

  useEffect(() => {
    setFormValue({
      eventName: eventName,
      duration: duration,
      email: email,
      description: description,
    });
  }, [eventName, duration, email, description]);

  const onCreateClick = async () => {
    setLoading(true);

    await createMeetingEvent.mutateAsync({
      eventName: eventName as string,
      duration: duration as number,
      description: description as string,
      meetEmail: email as string,
    });
  };

  return (
    <div className="p-8">
      <Link href={"/dashboard"}>
        <h2 className="flex gap-2">
          <ChevronLeft /> Cancel
        </h2>
      </Link>
      <div className="mt-4">
        <h2 className="my-4 text-2xl font-bold">Create New Event</h2>
        <hr></hr>
      </div>
      <div className="my-4 flex flex-col gap-3">
        <h2 className="font-bold">Event Name *</h2>
        <Input
          placeholder="Name of your meeting event"
          onChange={(event) => setEventName(event.target.value)}
        />

        <h2 className="font-bold">Duration *</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="max-w-40">
              {duration.toString()} Min
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setDuration(15)}>
              15 Min
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDuration(30)}>
              30 Min
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDuration(45)}>
              45 Min
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDuration(60)}>
              60 Min
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <h2 className="font-bold">Email for Google Meet</h2>

        <Input
          placeholder="example@gmail.com"
          onChange={(event) => setEmail(event.target.value)}
        />

        <h2 className="font-bold">Description</h2>
        <Textarea
          placeholder="Add Notes"
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <Button
        className={`mt-5 w-full ${loading && "bg-gray-300"}`}
        disabled={loading || !eventName || !duration || !email || !description}
        onClick={() => onCreateClick()}
      >
        Create
      </Button>
    </div>
  );
}

export default MeetingForm;
