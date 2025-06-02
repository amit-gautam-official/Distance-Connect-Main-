"use client";

import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { ChevronDown } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MonthData {
  month: string;
  completed: number;
  notCompleted: number;
}

interface ScheduledMeeting {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  meetUrl: string | null;
  completed: boolean;
  formatedTimeStamp: string;
  selectedDate: Date;
}

interface ScheduledSessionsProps {
  scheduledSessions: ScheduledMeeting[];
}

const ProgressChart: React.FC<ScheduledSessionsProps> = ({
  scheduledSessions,
}) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthsData, setMonthsData] = useState<MonthData[]>([]);

  useEffect(() => {
    if (!scheduledSessions) return;

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

    const initialData: MonthData[] = months.map((month) => ({
      month,
      completed: 0,
      notCompleted: 0,
    }));

    const dataByMonth = [...initialData];

    scheduledSessions.forEach((session) => {
      const date = new Date(session.selectedDate);
      if (date.getFullYear() === selectedYear) {
        const monthIndex = date.getMonth();
        if (monthIndex >= 0 && monthIndex < dataByMonth.length) {
          const monthData = dataByMonth[monthIndex];
          if (monthData) {
            if (session.completed) {
              monthData.completed += 1;
            } else {
              monthData.notCompleted += 1;
            }
          }
        }
      }
    });

    setMonthsData(dataByMonth);
  }, [scheduledSessions, selectedYear]);

  const chartData = {
    labels: monthsData.map((item) => item.month),
    datasets: [
      {
        label: "Completed Sessions",
        data: monthsData.map((item) => item.completed),
        backgroundColor: "rgb(59, 89, 152)", 
        borderRadius: 4,
      },
      {
        label: "Not Completed Sessions",
        data: monthsData.map((item) => item.notCompleted),
        backgroundColor: "rgb(144, 162, 213)",

        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.raw} ${context.dataset.label}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
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
      </div>

      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ProgressChart;
