import React from "react";
import { Connect } from "./sidebar/Connect";
import { Articles } from "./sidebar/Articles";
import { SimilarProfiles } from "./sidebar/SimilarProfiles";

interface Article {
  title: string;
  views: string;
}

interface SimilarMentorProfile {
  id: string;
  name: string;
  title: string;
  company: string;
  avatarUrl: string;
}

interface SidebarProps {
  mentorName: string;
  articles: Article[];
  mentorUserId: string;
  similarProfiles: SimilarMentorProfile[];
}

export function Sidebar({
  mentorName,
  mentorUserId,
  articles,
  similarProfiles,
}: SidebarProps) {
  return (
    <div className="space-y-6 md:col-span-1">
      {/* Connect section */}
      <Connect mentorName={mentorName} mentorUserId={mentorUserId} />
      
      {/* Articles section */}
      {/* <Articles articles={articles} /> */}
      
      {/* Similar profiles section */}
      <SimilarProfiles profiles={similarProfiles} />
    </div>
  );
} 