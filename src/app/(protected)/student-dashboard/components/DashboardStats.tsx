import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Clock, ClipboardList } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
    // trend?: {
    //   value: string;
    //   isPositive: boolean;
    //   label: string;
    // };
  iconBgColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  iconBgColor,
}) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="mt-1 text-3xl font-bold">{value}</h3>
           
          </div>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBgColor}`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface DashboardStatsProps {
  stats: {
    sessionsCompleted: number;
    sessionsCompletedTrend: string;
    totalTimeSpent: number;
    totalTimeSpentTrend: string;
    totalPending: number;
  };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatsCard
        title="Sessions Completed"
        value={stats.sessionsCompleted}
        icon={<ClipboardList className="h-6 w-6 text-blue-500" />}
        // trend={{
        //   value: stats.sessionsCompletedTrend,
        //   isPositive: true,
        //   label: "Up this month",
        // }}
        iconBgColor="bg-blue-100"
      />
      <StatsCard
        title="Total Time spent"
        value={`${stats.totalTimeSpent} min`}
        icon={<Clock className="h-6 w-6 text-red-500" />}
        // trend={{
        //   value: stats.totalTimeSpentTrend,
        //   isPositive: false,
        //   label: "Down from last month",
        // }}
        iconBgColor="bg-red-100"
      />
      <StatsCard
        title="Total Pending"
        value={stats.totalPending}
        icon={<ClipboardList className="h-6 w-6 text-orange-500" />}
        iconBgColor="bg-orange-100"
      />
    </div>
  );
};

export default DashboardStats;
