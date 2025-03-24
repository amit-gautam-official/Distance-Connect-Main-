"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, PlusCircle, Trophy } from "lucide-react";

const LearningProgress: React.FC = () => {
  // Mock data for learning goals
  const learningGoals = [
    {
      id: "1",
      title: "Complete intro to web development",
      progress: 75,
      completed: false,
    },
    {
      id: "2",
      title: "Build a portfolio website",
      progress: 40,
      completed: false,
    },
    {
      id: "3",
      title: "Learn React fundamentals",
      progress: 100,
      completed: true,
    },
  ];

  // Mock data for achievements
  const achievements = [
    {
      id: "1",
      title: "First Mentor Meeting",
      description: "Completed your first mentor session",
      icon: Trophy,
      date: "2 weeks ago",
    },
    {
      id: "2",
      title: "Learning Streak",
      description: "Logged in for 7 consecutive days",
      icon: Trophy,
      date: "1 week ago",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Learning Progress</CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Learning Goals Section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-medium">Current Goals</h3>
            <Button variant="ghost" size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Add Goal</span>
            </Button>
          </div>

          <div className="space-y-4">
            {learningGoals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  {goal.completed ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span
                    className={`text-sm ${goal.completed ? "text-muted-foreground line-through" : "font-medium"}`}
                  >
                    {goal.title}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {goal.progress}%
                  </span>
                </div>
                <Progress value={goal.progress} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div>
          <h3 className="mb-4 text-sm font-medium">Recent Achievements</h3>
          <div className="space-y-3">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className="flex items-start gap-3 rounded-lg bg-accent/50 p-2"
                >
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {achievement.date}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningProgress;
