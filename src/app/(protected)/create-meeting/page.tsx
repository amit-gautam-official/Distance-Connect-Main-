"use client";
import React, { useState } from "react";
import MeetingForm from "./_components/MeetingForm";
import PreviewMeeting from "./_components/PreviewMeeting";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function CreateMeeting() {
  const [formValue, setFormValue] = useState();
  const router = useRouter();
  const { data: userRole } = api.user.getUserRole.useQuery();

  useEffect(() => {
    if (userRole && userRole !== "MENTOR") {
      router.push("/");
    }
  }, [userRole]);


  if (userRole !== "MENTOR") {
    return null;
  }

  return (
    <div className="grid justify-center items-center grid-cols-1 md:grid-cols-3">
      {/* Meeting Form  */}
      <div className="h-screen border shadow-md">
        <MeetingForm
          setFormValue={(v: React.SetStateAction<undefined>) => setFormValue(v)}
        />
      </div>
      {/* Preview  */}
      <div className="md:col-span-2">
        <PreviewMeeting formValue={formValue!} />
      </div>
    </div>
  );
}

export default CreateMeeting;
