"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { PhoneCall } from "lucide-react";
import { useRouter } from "next/navigation";

const ExploreMentorsBanner: React.FC = () => {
  const router = useRouter();
  return (
    <div className="rounded-lg bg-blue-500 p-6 text-white">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <div className="mb-1 text-sm font-medium">1:1 CALLS</div>
          <h2 className="text-xl font-semibold">
            Explore Mentors based on different Domains
          </h2>
        </div>
        <Button
          onClick={() => router.push("/student-dashboard/mentors")}
          variant="secondary"
          className="flex items-center gap-2 bg-white text-blue-500 hover:bg-blue-50"
        >
          <span>Explore</span>
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white">
            <PhoneCall className="h-3 w-3" />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default ExploreMentorsBanner;
