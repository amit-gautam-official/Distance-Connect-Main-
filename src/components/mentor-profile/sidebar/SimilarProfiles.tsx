import React from "react";
import Image from "next/image";

interface SimilarMentorProfile {
  id: string;
  name: string;
  title: string;
  company: string;
  avatarUrl: string;
}

interface SimilarProfilesProps {
  profiles: SimilarMentorProfile[];
}

export function SimilarProfiles({ profiles }: SimilarProfilesProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">
        SIMILAR PROFILES
      </h3>
      <div className="space-y-4">
        {profiles.length > 0 ? (
          profiles.map((profile: SimilarMentorProfile, index: number) => (
            <div
              key={index}
              className="group flex cursor-pointer items-center"
            >
              <div className="mr-3 h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gray-200">
                {profile.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.name}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 font-bold text-blue-700">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                  {profile.name}
                </p>
                <p className="text-xs text-gray-500">{profile.title}</p>
              </div>
              <span className="text-xs text-blue-600">
                {profile.company}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600">
            No similar profiles found
          </p>
        )}
      </div>
      {profiles.length > 0 && (
        <button className="mt-6 flex items-center text-sm font-medium text-blue-600 hover:underline">
          SEE ALL PROFILES
          <svg
            className="ml-1 h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 5L19 12L12 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
} 