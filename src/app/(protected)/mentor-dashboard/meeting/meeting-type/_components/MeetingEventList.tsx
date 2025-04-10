"use client";
import { Button } from "@/components/ui/button";
import { Clock, Copy, MapPin, Pen, Settings, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type MeetingEvent = {
  description: string | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  eventName: string;
  duration: number;
  mentorUserId: string;
};

function MeetingEventList() {
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<MeetingEvent | null>(null);
  const [eventForm, setEventForm] = useState({
    eventName: "",
    duration: 0,
    description: "",
  });

  const { data, isError, isLoading, refetch } =
    api.meetingEvent.getMeetingEventList.useQuery(undefined, {
      // Reduce retries to avoid rate limit issues
      retry: 1,
      // Increase staleTime to reduce refetches
      staleTime: 5 * 60 * 1000, // 5 minutes
    });

  const deleteMeetingEvent = api.meetingEvent.deleteMeetingEvent.useMutation({
    onSuccess: () => {
      toast("Meeting Event Deleted!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMeetingEvent = api.meetingEvent.updateMeetingEvent.useMutation({
    onSuccess: () => {
      toast("Meeting Event Updated!");
      setIsEditDialogOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDeleteMeetingEvent = async (event: MeetingEvent) => {
    await deleteMeetingEvent.mutateAsync({
      id: event.id,
    });
  };

  const onEditMeetingEvent = (event: MeetingEvent) => {
    setEditingEvent(event);
    setEventForm({
      eventName: event.eventName,
      duration: event.duration,
      description: event.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEventForm({
      ...eventForm,
      [name]: name === "duration" ? parseInt(value) || 0 : value,
    });
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    await updateMeetingEvent.mutateAsync({
      id: editingEvent.id,
      eventName: eventForm.eventName,
      duration: eventForm.duration,
      description: eventForm.description,
    });
  };

  const onCopyClickHandler = (event: MeetingEvent) => {
    const meetingEventUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000" + "/" + event.mentorUserId + "/" + event.id
        : "https://dictanceconnect.in" +
          "/" +
          event.mentorUserId +
          "/" +
          event.id;
    navigator.clipboard.writeText(meetingEventUrl);
    toast("Copied to Clipboard");
  };

  return (
    <>
      <div className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
        {data && data?.length > 0 ? (
          data?.map((event, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-lg border border-t-8 p-5 shadow-md"
            >
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Settings className="cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      className="flex gap-2"
                      onClick={() => onEditMeetingEvent(event)}
                    >
                      <Pen className="h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex gap-2"
                      onClick={() => onDeleteMeetingEvent(event)}
                    >
                      <Trash className="h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <h2 className="text-xl font-medium">{event?.eventName}</h2>
              <div className="flex justify-between">
                <h2 className="flex gap-2 text-gray-500">
                  <Clock /> {event.duration} Min{" "}
                </h2>
              </div>
              {event.description && (
                <p className="text-sm text-gray-600">{event.description}</p>
              )}
              <hr></hr>
              <div className="flex justify-between">
                <h2
                  className="flex cursor-pointer items-center gap-2 text-sm text-primary"
                  onClick={() => {
                    onCopyClickHandler(event);
                  }}
                >
                  <Copy className="h-4 w-4" /> Copy Link{" "}
                </h2>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center">
            <h2>Create a new meeting type</h2>
          </div>
        )}
      </div>

      {/* Edit Meeting Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Meeting Event</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="eventName">Event Name</Label>
                <Input
                  id="eventName"
                  name="eventName"
                  value={eventForm.eventName}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={eventForm.duration}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={eventForm.description}
                  onChange={handleFormChange}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateMeetingEvent.isPending}
              >
                {updateMeetingEvent.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default MeetingEventList;