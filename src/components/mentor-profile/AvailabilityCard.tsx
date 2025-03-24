import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JSONValue } from "node_modules/superjson/dist/types";


// ype '{ id: string; createdAt: Date; updatedAt: Date; mentorUserId: string; daysAvailable: JsonValue; startTime: string; endTime: string; }' is missing the following properties from type '{ timezone: string; availableDays: string[]; availableHours: string; nextAvailable: string; }': timezone, availableDays, availableHours, nextAvailablets(2739)

// Type '{ meetingEvents: { id: string; createdAt: Date; updatedAt: Date; mentorUserId: string; eventName: string; duration: number; description: string | null; meetEmail: string; }[]; avail: { ...; }; availability: { ...; }; }' is not assignable to type 'IntrinsicAttributes & AvailabilityCardProps'.

interface AvailabilityCardProps {
  availability: {
    timezone: string;
    availableDays: string[];
    availableHours: string;
    nextAvailable: string;
  };
  avail: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    mentorUserId: string;
    daysAvailable: JSONValue;
    startTime: string;
    endTime: string;
  };

  
}
// {
//   "id": "67d0b5f21cbb7c7628a083ae",
//   "mentorUserId": "67bf7ffc6c46d90a20677cd4",
//   "daysAvailable": {
//       "Sunday": false,
//       "Monday": false,
//       "Tuesday": false,
//       "Wednesday": false,
//       "Thursday": true,
//       "Friday": true,
//       "Saturday": true
//   },
//   "startTime": "00:00",
//   "endTime": "23:23",
//   "createdAt": "2025-03-11T22:15:14.152Z",
//   "updatedAt": "2025-03-11T22:15:14.152Z"
// }

export function AvailabilityCard({ availability, avail }: AvailabilityCardProps) {
  console.log("avail", avail);
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Availability</h2>
     
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-2 text-sm font-medium text-gray-500">
            Timezone
          </h3>
          <p className="text-gray-800">{availability.timezone}</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-2 text-sm font-medium text-gray-500">
            Available Days
          </h3>
          <p className="text-gray-800">

            { avail?.daysAvailable &&
            Object.keys(avail?.daysAvailable as any).filter(day => (avail?.daysAvailable as any)[day]).join(", ")}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-2 text-sm font-medium text-gray-500">
            Available Hours
          </h3>
          <p className="text-gray-800">{avail?.startTime} - {avail?.endTime}</p>
        </div>
      </div>

   
    </div>
  );
} 