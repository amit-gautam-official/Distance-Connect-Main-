"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Link from "next/link";

interface Offering {
  id: string;
  title: string;
  description: string;
  rating: number;
  duration: string;
  price: string;
  type: string;
  repliesIn: string;
  priority: number;
  mentorUserId : string;
  userEmail : string;
}

interface OfferingsProps {
  offerings: Offering[];
}

export function Offerings({ offerings }: OfferingsProps) {
  const [filter, setFilter] = useState<string>("All");
  
  const filteredOfferings = filter === "All" 
    ? offerings 
    : offerings.filter(offering => offering.type === filter);

  return (
    <div id="offerings">
      <h2 className="mb-6 text-xl font-bold text-gray-900">
        Services & Offerings
      </h2>



      {/* Offerings list */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredOfferings.map((offering) => (
          <div
            key={offering.id}
            className="relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-green-100/30 shadow-sm transition-all hover:shadow-md"
          >
            {/* Top-right badge */}
            <div className="absolute top-4 right-4 z-10">
              <Badge className="bg-green-100 text-green-800 font-medium px-3 py-1 rounded-full text-xs shadow">First Session Free</Badge>
            </div>
            <div className="p-6">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-sm font-medium">
                    {offering.rating}
                  </span>
                </div>
                
              </div>
              
              <h3 className="mb-2 text-xl font-semibold text-gray-800">
                {offering.title}
              </h3>
              {offering.description && (
                <p className="mb-4 text-gray-600">
                  {offering.description}
                </p>
              )}

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {offering.duration && (
                    <div className="flex items-center text-sm">
                      <div className="mr-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-blue-100">
                        <svg
                          className="h-3.5 w-3.5 text-blue-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M12 7V12L15 15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <span>{offering.duration}</span>
                    </div>
                  )}
                  {offering.price && (
                    <div className="text-sm font-semibold">
                      <span className="text-blue-600">
                        {offering.price}
                      </span>
                    </div>
                  )}
                </div>

                {offering.price && (
                  <Link
                    href={offering?.userEmail ? `/${offering?.mentorUserId}/${offering?.id}` : "/auth/login"}
                   
                    className="rounded-full flex justify-center items-center text-sm w-[60px] m-auto h-[30px] border bg-white p-auto text-blue-600 hover:bg-blue-50"
                  >
                    <p>
                      Book
                    </p>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 