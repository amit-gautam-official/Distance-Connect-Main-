import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, CalendarCheck, CalendarClock } from "lucide-react";

interface StatsProps {
  stats: {
    totalMeetings: number;
    completedMeetings: number;
    totalMentors: number;
    learningHours: number;
  };
}

const StatsOverview: React.FC<StatsProps> = ({ stats }) => {
  const statItems = [
    {
      title: "Total Meetings",
      value: stats.totalMeetings,
      icon: CalendarClock,
      color: "bg-blue-100 text-blue-700",
      description: "All scheduled sessions",
    },
    {
      title: "Completed",
      value: stats.completedMeetings,
      icon: CalendarCheck,
      color: "bg-green-100 text-green-700",
      description: "Finished sessions",
    },
    {
      title: "Active Mentors",
      value: stats.totalMentors,
      icon: Users,
      color: "bg-purple-100 text-purple-700",
      description: "Your current mentors",
    },
    {
      title: "Learning Hours",
      value: stats.learningHours,
      icon: Clock,
      color: "bg-amber-100 text-amber-700",
      description: "Total time spent learning",
    },
  ];

  return (
    <>
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`rounded-full p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
};

export default StatsOverview;
