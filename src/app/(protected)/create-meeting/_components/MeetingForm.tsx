"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  Calendar,
  Clock,
  Mail,
  FileText,
  Users,
  Video,
  ChevronDown,
} from "lucide-react";
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
  const [confirmEmail, setConfirmEmail] = useState<string>("");
  const [description, setDescription] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [customEventName, setCustomEventName] = useState<boolean>(false);
  const router = useRouter();
  const [price, setPrice] = useState<number>();

 



  const getMeQuery = api.mentor.getMentor.useQuery();

  const mentorSessionPriceRange = getMeQuery.data?.mentorSessionPriceRange; //Ex: "500-700" //string

  const [minPrice, maxPrice] = mentorSessionPriceRange
  ? mentorSessionPriceRange.split("-").map(Number)
  : [500, 700]; // Default range



  const createMeetingEvent = api.meetingEvent.createMeetingEvent.useMutation({
    onSuccess: () => {
      toast("New Meeting Event Created!");
      router.push("/mentor-dashboard/services");
      setLoading(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    setFormValue({
      eventName: eventName,
      duration: duration,
      email: email,
      description: description,
      price: price ?? Number(minPrice),
    });
  }, [eventName, duration, email, description, price]);

  const onCreateClick = async () => {
    setLoading(true);

    // Verify that the email is a Gmail address
    if (!email.endsWith("@gmail.com")) {
      toast.error("Please use a Gmail address for Google Meet integration.");
      setLoading(false);
      return;
    }
    // Confirm email match
    if (email !== confirmEmail) {
      toast.error("Email and Confirm Email do not match.");
      setLoading(false);
      return;
    }

    await createMeetingEvent.mutateAsync({
      eventName: eventName as string,
      duration: duration as number,
      description: description as string,
      meetEmail: email as string,
      price: price ? Number(price) : Number(minPrice),

    });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header Section */}
      <div className="border-b bg-white p-6">
        <h2 className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900">
          <Link
            className="flex items-center gap-2"
            href={"/mentor-dashboard/services"}
          >
            <ChevronLeft className="h-5 w-5" /> Back to Services
          </Link>
        </h2>
        <div className="mt-4">
          <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
          <p className="mt-1 text-sm text-gray-600">
            Set up a new meeting event for your mentees
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="mx-auto max-w-2xl space-y-8">
          {/* Meeting Type Section */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Meeting Type
              </h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  Event Name *
                </label>
               { !customEventName && 
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 w-full justify-start text-left font-normal"
                  >
                    {eventName || "Select meeting type"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem
                    onClick={() => setEventName("One-on-One Mentorship")}
                  >
                    One-on-One Mentorship
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setEventName("Group Mentorship")}
                  >
                    Group Mentorship
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setEventName("Career Guidance")}
                  >
                    Career Guidance
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setEventName("Interview Preparation")}
                  >
                    Interview Preparation
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setEventName("Mock Interview Prep")}
                  >
                    Mock Interview Prep
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setCustomEventName(true)}

                  >
                    Custom
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              }
                {
                  customEventName && (
                    <Input
                      placeholder="Enter custom meeting type"
                      onChange={(event) => setEventName(event.target.value)}
                      className="h-11"
                    />
                  ) 
                }
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Clock className="h-4 w-4 text-gray-500" />
                  Duration *

                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-11 w-40">
                      {duration.toString()} Min  <ChevronDown className="h-4 w-4 text-gray-500" />
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
              
              </div>
            </div>
          </div>

          {/* Price Selection Section */}
<div className="rounded-lg bg-white p-6 shadow-sm">
  <div className="mb-4 flex items-center gap-2">
    <Clock className="h-5 w-5 text-blue-600" />
    <h3 className="text-lg font-semibold text-gray-900">Session Price</h3>
  </div>
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">
      Choose your session price (₹{minPrice}–₹{maxPrice})
    </label>
    <input
      type="range"
      min={minPrice}
      max={maxPrice}
      step={50}
      value={price ?? minPrice}
      onChange={(e) => setPrice(Number(e.target.value))}
      className="w-full"
    />
    <div className="text-sm text-gray-600">Selected: ₹{price ?? minPrice}</div>
  </div>
</div>



          {/* Meeting Details Section */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Video className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Meeting Details
              </h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Mail className="h-4 w-4 text-gray-500" />
                  Email for Google Meet
                </label>
                <Input
                  placeholder="example@gmail.com"
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-11"
                  value={email}
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Mail className="h-4 w-4 text-gray-500" />
                  Confirm Email Address
                </label>
                <Input
                  placeholder="Re-enter your Gmail address"
                  onChange={(event) => setConfirmEmail(event.target.value)}
                  className="h-11"
                  value={confirmEmail}
                  onCopy={e => { e.preventDefault(); toast.error('Copying is disabled for this field.'); }}
                  onPaste={e => { e.preventDefault(); toast.error('Pasting is disabled for this field.'); }}
                  onCut={e => { e.preventDefault(); toast.error('Cutting is disabled for this field.'); }}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FileText className="h-4 w-4 text-gray-500" />
                  Description
                </label>
                <Textarea
                  placeholder="Add notes about the meeting..."
                  onChange={(event) => setDescription(event.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="border-t bg-white p-6">
        <div className="mx-auto max-w-2xl">
          <Button
            className={`h-11 w-full text-base font-medium ${
              loading ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={
              loading || !eventName || !duration || !email || !description || !confirmEmail || email !== confirmEmail || !email.endsWith("@gmail.com")
            }
            onClick={() => onCreateClick()}
          >
            {loading ? "Creating..." : "Create Event"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default MeetingForm;
