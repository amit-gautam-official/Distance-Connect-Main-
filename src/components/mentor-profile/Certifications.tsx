import React from "react";
import { Badge } from "@/components/ui/badge";

interface CertificationsProps {
  certifications: string[];
}

export function Certifications({ certifications }: CertificationsProps) {
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
            d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Certifications
      </h2>

      <div className="flex flex-wrap gap-3">
        {certifications.map((cert, index) => (
          <Badge
            key={index}
            className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-blue-700"
          >
            {cert}
          </Badge>
        ))}
      </div>
    </div>
  );
} 