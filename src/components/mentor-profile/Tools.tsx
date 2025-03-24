import React from "react";
import { Badge } from "@/components/ui/badge";

interface ToolsProps {
  tools: string[];
}

export function Tools({ tools }: ToolsProps) {
  return (
    <div>
      <h2 className="mb-6 flex items-center text-xl font-bold text-gray-900">
        <svg
          className="mr-2 h-6 w-6 text-gray-500"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Tools
      </h2>

      <div className="flex flex-wrap gap-3">
        {tools.map((tool, index) => (
          <Badge
            key={index}
            className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 text-purple-700 hover:bg-purple-100"
          >
            {tool}
          </Badge>
        ))}
      </div>
    </div>
  );
} 