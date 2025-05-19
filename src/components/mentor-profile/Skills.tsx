import React from "react";
import { Badge } from "@/components/ui/badge";



interface SkillsProps {
  skillGroups: string[];
}

export function Skills({ skillGroups }: SkillsProps) {
  return (
    <div >
      <h2 className="mb-6 flex items-center text-xl font-bold text-gray-900">
        <svg
          className="mr-2 h-6 w-6 text-gray-500"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 18L22 12L16 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 6L2 12L8 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Skills
      </h2>

      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4  lg:grid-cols-6 ">
        {skillGroups.map((skill, groupIndex) => (
          <div key={groupIndex}>
            
            <div className="flex flex-wrap gap-2">
                <Badge  
                  className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-gray-800 hover:bg-gray-100"
                >
                  {skill}
                </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 