import React from "react";
import { Button } from "@/components/ui/button";

interface Experience {
  title: string;
  company: string;
  period: string;
  duration: string;
}

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  return (
    <div>
      <div className="mb-6 flex items-center">
        <svg
          className="mr-2 h-6 w-6 text-gray-500"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="3"
            y="6"
            width="18"
            height="15"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M3 10H21"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M8 3V7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M16 3V7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <h2 className="text-xl font-bold text-gray-900">
          Professional Experience
        </h2>
      </div>

      <div className="space-y-6 border-l-2 border-gray-200 pl-6">
        {experiences.map((exp, index) => (
          <div key={index} className="relative">
            <div className="absolute -left-[30px] top-1 h-5 w-5 rounded-full border-4 border-white bg-blue-500"></div>
            <div className="flex flex-col justify-between pb-2 md:flex-row md:items-center">
              <h3 className="text-lg font-medium text-gray-800">
                {exp.title}
              </h3>
              <div className="text-sm text-gray-500">
                {exp.period} · {exp.duration}
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <div className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                P
              </div>
              <span className="font-medium text-gray-700">
                {exp.company}
              </span>
            </div>
          </div>
        ))}

        <Button
          variant="ghost"
          className="mt-4 flex items-center text-blue-600 hover:text-blue-700"
        >
          <span>Show All Experiences</span>
          <svg
            className="ml-1 h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
} 