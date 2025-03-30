"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface SessionData {
  month: string;
  count: number;
}

interface TrackSessionsProps {
  sessionData: SessionData[];
}

const TrackSessions: React.FC<TrackSessionsProps> = ({ sessionData }) => {
  // Prepare data for the chart
  const labels = sessionData.map((item) => item.month.substring(0, 3));
  const counts = sessionData.map((item) => item.count);

  // Chart data
  const chartData = {
    labels,
    datasets: [
      {
        label: "Sessions",
        data: counts,
        backgroundColor: "#3b82f6", // blue-500
        borderRadius: 4,
        maxBarThickness: 20,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1f2937", // gray-800
        padding: 10,
        titleFont: {
          size: 12,
        },
        bodyFont: {
          size: 12,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(...counts, 12),
        ticks: {
          stepSize: 3,
          font: {
            size: 10,
          },
          color: "#6b7280", // gray-500
        },
        grid: {
          color: "rgba(243, 244, 246, 0.6)", // gray-100 with opacity
          borderDash: [5, 5],
        },
        border: {
          dash: [5, 5],
        },
      },
      x: {
        ticks: {
          font: {
            size: 10,
          },
          color: "#6b7280", // gray-500
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Track Sessions</CardTitle>
     
      </CardHeader>
      <CardContent>
        {/* Chart Container */}
        <div className="h-60">
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center">
          <div className="flex items-center">
            <div className="mr-1 h-3 w-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-muted-foreground">Sessions</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackSessions;
