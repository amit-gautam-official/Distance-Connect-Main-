"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const monthsData = [
  { month: "JAN", value: 78 },
  { month: "FEB", value: 85 },
  { month: "MAR", value: 82 },
  { month: "APR", value: 76 },
  { month: "MAY", value: 75 },
  { month: "JUN", value: 75 },
  { month: "JUL", value: 53 },
  { month: "AUG", value: 78 },
  { month: "SEP", value: 78 },
  { month: "OCT", value: 78 },
  { month: "NOV", value: 0 },
  { month: "DEC", value: 45 },
];

const ProgressChart = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const maxValue = 100; // Maximum value for the chart

  // Function to download details (placeholder)
  const downloadDetails = () => {
    console.log("Downloading details...");
    // Implement download functionality here
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">
          2024 WORKING PROGRESS
        </h2>
        <div className="relative">
          <button
            className="flex items-center gap-1 rounded border border-gray-300 px-3 py-1 text-sm"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            YEAR <ChevronDown className="h-4 w-4" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 z-10 mt-1 w-24 rounded-md border border-gray-200 bg-white shadow-lg">
              <div className="py-1">
                <button
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  2024
                </button>
                <button
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  2023
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative mb-4 h-48">
        {/* Y-axis labels */}
        <div className="absolute -left-4 top-0 flex h-full flex-col justify-between text-xs text-gray-500">
          <span>100</span>
          <span>75</span>
          <span>50</span>
          <span>25</span>
          <span>0</span>
        </div>

        {/* Chart grid */}
        <div className="absolute left-6 right-0 top-0 flex h-full flex-col justify-between">
          <div className="border-t border-gray-200"></div>
          <div className="border-t border-gray-200"></div>
          <div className="border-t border-gray-200"></div>
          <div className="border-t border-gray-200"></div>
          <div className="border-t border-gray-200"></div>
        </div>

        {/* Chart bars */}
        <div className="absolute bottom-0 left-6 right-0 flex h-40 items-end justify-between">
          {monthsData.map((item, index) => (
            <div key={index} className="flex w-6 flex-col items-center">
              <div
                className={`w-5 ${
                  item.month === "JUL" || item.month === "DEC"
                    ? "bg-teal-500"
                    : "bg-blue-600"
                }`}
                style={{
                  height: `${(item.value / maxValue) * 160}px`,
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="ml-6 flex justify-between pl-1 text-xs text-gray-500">
        {monthsData.map((item, index) => (
          <div key={index} className="w-6 text-center">
            {item.month}
          </div>
        ))}
      </div>

      {/* Download details */}
      <button
        onClick={downloadDetails}
        className="mt-4 flex items-center text-xs font-medium text-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-1 h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
        DOWNLOAD DETAILS
      </button>
    </div>
  );
};

export default ProgressChart;
