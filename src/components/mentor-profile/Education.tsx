import React from "react";

interface EducationItem {
  degree: string;
  institution: string;
  year: string;
}

interface EducationProps {
  education: EducationItem[];
}

export function Education({ education }: EducationProps) {
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
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Education
      </h2>

      <div className="space-y-5">
        {education.length === 0 && (
          <p className="text-gray-500 border-l-2 pl-6">No education information available.</p>
        )}
        {education.map((edu, index) => (
          <div
            key={index}
            className="relative border-l-2 border-gray-200 pl-6"
          >
            <div className="absolute -left-[10px] top-1 h-5 w-5 rounded-full border-4 border-white bg-blue-500"></div>
            <h3 className="text-lg font-medium text-gray-800">
              {edu.degree}
            </h3>
            <p className="text-gray-600">{edu.institution}</p>
            <p className="text-sm text-gray-500">{edu.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 