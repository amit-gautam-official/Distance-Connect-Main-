"use client";
import React from "react";

function MeetingEventSkeleton() {
  return (
    <div className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((index) => (
        <div 
          key={index}
          className="flex flex-col gap-3 rounded-lg border border-t-8 border-t-gray-200 p-5 shadow-md"
        >
          <div className="flex justify-end">
            <div className="h-5 w-5 rounded-full bg-gray-200 animate-pulse"></div>
          </div>
          <div className="h-6 w-3/4 rounded-md bg-gray-200 animate-pulse"></div>
          <div className="flex justify-between">
            <div className="h-4 w-1/4 rounded-md bg-gray-200 animate-pulse"></div>
          </div>
          <div className="h-4 w-full rounded-md bg-gray-200 animate-pulse"></div>
          <div className="h-4 w-11/12 rounded-md bg-gray-200 animate-pulse"></div>
          <hr className="my-1"></hr>
          <div className="flex justify-between">
            <div className="h-4 w-1/4 rounded-md bg-gray-200 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MeetingEventSkeleton;