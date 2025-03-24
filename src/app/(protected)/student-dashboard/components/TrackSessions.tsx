"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface SessionData {
  month: string;
  count: number;
}

const monthNames = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

interface TrackSessionsProps {
  sessionData: SessionData[];
}

const TrackSessions: React.FC<TrackSessionsProps> = ({ sessionData }) => {
  const [activeView, setActiveView] = useState<"Year" | "Month" | "Week">(
    "Year",
  );

  // Find the maximum count to scale the bars
  const maxCount = Math.max(...sessionData.map((item) => item.count), 12);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Track Sessions</CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-end space-x-1">
          {["Year", "Month", "Week"].map((view) => (
            <Button
              key={view}
              variant={activeView === view ? "default" : "ghost"}
              size="sm"
              className={`h-7 px-3 text-xs ${
                activeView === view ? "" : "text-muted-foreground"
              }`}
              onClick={() => setActiveView(view as "Year" | "Month" | "Week")}
            >
              {view}
            </Button>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          {/* Y-axis labels */}
          <div className="flex justify-end pb-2">
            <div className="grid w-full grid-cols-6">
              <div className="col-span-1 pr-2 text-right">
                <div className="text-xs text-muted-foreground">12</div>
              </div>
              <div className="col-span-5"></div>
            </div>
          </div>
          <div className="flex justify-end pb-2">
            <div className="grid w-full grid-cols-6">
              <div className="col-span-1 pr-2 text-right">
                <div className="text-xs text-muted-foreground">9</div>
              </div>
              <div className="col-span-5 border-t border-dashed border-gray-200"></div>
            </div>
          </div>
          <div className="flex justify-end pb-2">
            <div className="grid w-full grid-cols-6">
              <div className="col-span-1 pr-2 text-right">
                <div className="text-xs text-muted-foreground">6</div>
              </div>
              <div className="col-span-5 border-t border-dashed border-gray-200"></div>
            </div>
          </div>
          <div className="flex justify-end pb-2">
            <div className="grid w-full grid-cols-6">
              <div className="col-span-1 pr-2 text-right">
                <div className="text-xs text-muted-foreground">3</div>
              </div>
              <div className="col-span-5 border-t border-dashed border-gray-200"></div>
            </div>
          </div>

          {/* Chart */}
          <div className="flex h-40 items-end space-x-2">
            {sessionData.map((item, index) => (
              <div key={index} className="flex flex-1 flex-col items-center">
                <div
                  className="w-full rounded-t bg-blue-500"
                  style={{
                    height: `${(item.count / maxCount) * 100}%`,
                    maxWidth: "20px",
                    margin: "0 auto",
                  }}
                ></div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {item.month}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center">
            <div className="flex items-center">
              <div className="mr-1 h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-muted-foreground">Sessions</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackSessions;
