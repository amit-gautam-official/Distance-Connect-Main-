"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, BookOpen, Calendar, Award } from "lucide-react";

const UserAchievements = () => {
  // Mock data for achievements - in a real app, this would come from an API
  const achievements = [
    {
      id: "1",
      title: "First Connection",
      description: "Connected with your first mentor",
      icon: Trophy,
      completed: true,
      date: "2023-10-15",
    },
    {
      id: "2",
      title: "Profile Completed",
      description: "Filled out all profile information",
      icon: Target,
      completed: true,
      date: "2023-10-10",
    },
    {
      id: "3",
      title: "Learning Streak",
      description: "Completed 7 days of learning activities",
      icon: BookOpen,
      completed: false,
      progress: 5,
      total: 7,
    },
    {
      id: "4",
      title: "First Meeting",
      description: "Scheduled your first mentor meeting",
      icon: Calendar,
      completed: true,
      date: "2023-10-20",
    },
    {
      id: "5",
      title: "Skill Certification",
      description: "Earned your first skill certification",
      icon: Award,
      completed: false,
      progress: 0,
      total: 1,
    },
  ];

  // Group achievements by completion status
  const completedAchievements = achievements.filter((a) => a.completed);
  const inProgressAchievements = achievements.filter((a) => !a.completed);

  return (
    <div className="space-y-6">
      {/* Stats overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-3xl font-bold text-blue-600">
              {completedAchievements.length}
            </div>
            <p className="text-sm text-gray-500">Achievements Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-3xl font-bold text-blue-600">3</div>
            <p className="text-sm text-gray-500">Mentor Connections</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="text-3xl font-bold text-blue-600">5</div>
            <p className="text-sm text-gray-500">Learning Hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Completed achievements */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Completed Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          {completedAchievements.length > 0 ? (
            <div className="space-y-4">
              {completedAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <achievement.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-800">
                        {achievement.title}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {new Date(achievement.date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No achievements completed yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* In progress achievements */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {inProgressAchievements.length > 0 ? (
            <div className="space-y-4">
              {inProgressAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <achievement.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-800">
                        {achievement.title}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {achievement.progress}/{achievement.total}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {achievement.description}
                    </p>
                    <Progress
                      value={(achievement.progress / achievement.total) * 100}
                      className="mt-2 h-1.5"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No achievements in progress
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserAchievements;
