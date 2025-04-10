"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { api } from "@/trpc/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface MonthData {
  month: string;
  value: number;
}

const ProgressChart = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { data: scheduledSessions } =
    api.scheduledMeetings.getMentorScheduledMeetings.useQuery();

  const [monthsData, setMonthsData] = useState<MonthData[]>([]);

  useEffect(() => {
    if (!scheduledSessions) return;

    // Initialize months data with zeros
    const months = [
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
    const initialData = months.map((month) => ({ month, value: 0 }));
    setMonthsData(initialData);

    // Calculate completed sessions per month
    const completedSessions = scheduledSessions.filter(
      (session) => session?.completed,
    );
    // console.log("scheduledSessions", scheduledSessions);
    // console.log("completedSessions", completedSessions);
    const sessionsByMonth = completedSessions.reduce(
      (acc, session) => {
        const date = new Date(session?.selectedDate);
        if (date.getFullYear() === selectedYear) {
          const monthIndex = date.getMonth();
          acc[monthIndex] = (acc[monthIndex] || 0) + 1;
        }
        return acc;
      },
      {} as Record<number, number>,
    );

    // console.log("sessionsByMonth", sessionsByMonth);

    // Update months data with actual values
    const updatedData = months.map((month, index) => ({
      month,
      value: sessionsByMonth[index] || 0,
    }));

    setMonthsData(updatedData);
  }, [scheduledSessions, selectedYear]);

  const chartData = {
    labels: monthsData.map((item) => item.month),
    datasets: [
      {
        label: "Completed Sessions",
        data: monthsData.map((item) => item.value),
        backgroundColor: monthsData.map(
          (item) =>
            item.month === "JUL" || item.month === "DEC"
              ? "rgb(20 184 166)" // teal-500
              : "rgb(37 99 235)", // blue-600
        ),
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.raw} completed sessions`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(...monthsData.map((item) => item.value)) + 1,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">
          {selectedYear} WORKING PROGRESS
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
                  onClick={() => {
                    setSelectedYear(2024);
                    setIsDropdownOpen(false);
                  }}
                >
                  2024
                </button>
                <button
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => {
                    setSelectedYear(2023);
                    setIsDropdownOpen(false);
                  }}
                >
                  2023
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-48">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ProgressChart;
