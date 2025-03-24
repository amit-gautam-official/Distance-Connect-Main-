"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, Calendar } from "lucide-react";

interface Mentor {
  id: string;
  name: string;
  title: string;
  image?: string;
  skills: string[];
  rating: number;
  availability?: string;
}

interface MentorSuggestionsProps {
  mentors: Mentor[];
}

const MentorSuggestions: React.FC<MentorSuggestionsProps> = ({
  mentors = [],
}) => {
  // If no mentors, show empty state
  if (mentors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Suggested Mentors</CardTitle>
        </CardHeader>
        <CardContent className="py-6 text-center">
          <p className="text-sm text-muted-foreground">
            We're finding the perfect mentors for you based on your interests.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Suggested Mentors</CardTitle>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mentors.slice(0, 3).map((mentor) => (
            <div
              key={mentor.id}
              className="flex flex-col gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={mentor.image} alt={mentor.name} />
                  <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <h4 className="font-medium">{mentor.name}</h4>
                  <p className="truncate text-sm text-muted-foreground">
                    {mentor.title}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span className="text-sm font-medium">
                    {mentor.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {mentor.skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {mentor.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{mentor.skills.length - 3} more
                  </Badge>
                )}
              </div>

              {mentor.availability && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Available: {mentor.availability}</span>
                </div>
              )}

              <div className="mt-1 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Message</span>
                </Button>
                <Button size="sm" className="flex-1">
                  <Calendar className="mr-1 h-3.5 w-3.5" />
                  <span>Schedule</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MentorSuggestions;
