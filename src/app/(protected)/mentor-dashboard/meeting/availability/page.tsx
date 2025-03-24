"use client";
import DaysList from "@/lib/DaysList";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { api } from "@/trpc/react";

function Availability() {
  type DaysAvailable = {
    Sunday: boolean;
    Monday: boolean;
    Tuesday: boolean;
    Wednesday: boolean;
    Thursday: boolean;
    Friday: boolean;
    Saturday: boolean;
  };
  const [daysAvailable, setDaysAvailable] = useState<DaysAvailable>({
    Sunday: false,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
  });
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const createAndUpdateAvailability =
    api.availability.createAndUpdateAvailability.useMutation({
      onSuccess: () => {
        toast("Availability Created!");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const onHandleChange = (day: string, value: string | boolean) => {
    setDaysAvailable({
      ...daysAvailable,
      [day]: value,
    });

    //console.log(daysAvailable)
  };

  const handleSave = async () => {
    // //console.log(daysAvailable,startTime,endTime);
    // const docRef=doc(db,'Business',user?.email);
    // await updateDoc(docRef,{
    //     daysAvailable:daysAvailable,
    //     startTime:startTime,
    //     endTime:endTime
    // }).then(resp=>{
    //     toast('Change Updated !')
    // })
    await createAndUpdateAvailability.mutateAsync({
      daysAvailable: daysAvailable,
      startTime: startTime ?? "",
      endTime: endTime ?? "",
    });
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold">Availability</h2>
      <hr className="my-7"></hr>
      <div>
        <h2 className="font-bold">Availability Days</h2>
        <div className="my-3 grid grid-cols-2 gap-5 md:grid-cols-4">
          {DaysList &&
            DaysList.map((item, index) => (
              <div key={index}>
                <h2>
                  <Checkbox
                    checked={
                      daysAvailable &&
                      daysAvailable[item?.day as keyof DaysAvailable]
                        ? daysAvailable[item?.day as keyof DaysAvailable]
                        : false
                    }
                    onCheckedChange={(e) => onHandleChange(item.day, e)}
                  />{" "}
                  {item.day}
                </h2>
              </div>
            ))}
        </div>
      </div>
      <div>
        <h2 className="mt-10 font-bold">Availability Time</h2>
        <div className="flex gap-10">
          <div className="mt-3">
            <h2>Start Time</h2>
            <Input
              type="time"
              defaultValue={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <h2>End Time</h2>
            <Input
              type="time"
              defaultValue={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
      </div>
      <Button className="mt-10" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
}

export default Availability;
