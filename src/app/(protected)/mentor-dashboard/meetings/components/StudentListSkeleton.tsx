"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const StudentListSkeleton = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {/* Title skeleton */}
          <div className="h-6 w-32 rounded-md bg-gray-200 animate-pulse"></div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and filter skeleton */}
        <div className="mb-4 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-300" />
              <div className="h-10 w-full rounded-md border border-gray-200 bg-gray-100"></div>
            </div>
            <div className="h-10 w-10 rounded-md border border-gray-200 bg-gray-100 flex items-center justify-center">
              <Filter size={16} className="text-gray-300" />
            </div>
          </div>
        </div>

        {/* Student list items skeletons */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg border p-4 animate-pulse"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {/* Avatar skeleton */}
                  <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                  <div>
                    {/* Name skeleton */}
                    <div className="h-5 w-32 rounded bg-gray-200"></div>
                    {/* Role skeleton */}
                    <div className="mt-1 h-4 w-24 rounded bg-gray-200"></div>
                    {/* Institution skeleton */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-4 w-4 rounded bg-gray-200"></div>
                      <div className="h-4 w-40 rounded bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Expertise badges skeleton */}
              <div className="mt-3 flex flex-wrap gap-2">
                {Array.from({ length: 3 }).map((_, badgeIndex) => (
                  <div
                    key={badgeIndex}
                    className="h-6 w-16 rounded-full bg-gray-200"
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentListSkeleton;