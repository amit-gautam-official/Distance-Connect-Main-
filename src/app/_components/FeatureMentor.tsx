"use client";

import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import MentorCard from "./MentorCard";

export default function FeatureMentor() {
  const mentors = [
    // {
    //   name: "Utkarsh Verma",
    //   company: "Maruti Suzuki India Limited",
    //   experience: "0-2  years",
    //   img: "https://storage.googleapis.com/dc-profile-image/6826d7d1fb786cad8f5f5f96-94341be2-8f93-4ce9-8439-cc0f8779e9f0.webp",
    // },
    // {
    //   name: "jitin trehan",
    //   company: "Phonepe",
    //   experience: "0-2 years",
    //   img: "https://storage.googleapis.com/dc-profile-image/682ec267fb786cad8f5f5fb1-4e36ad5a-0a1b-40ef-ad72-9ef38c44eec6.webp",
    // },
    // {
    //   name: "Mayank Tutwani",
    //   company: "Google",
    //   experience: "10+ years",
    //   img: "",
    // },
    // {
    //   name: "Akshit Singh",
    //   company: "Bharti Airtel Limited",
    //   experience: "6-10 years",
    //   img: "https://storage.googleapis.com/dc-profile-image/682ecc94fb786cad8f5f5fb8-5afaf9f0-d2f1-4d49-8247-a12f6ddedaa4.webp",
    // },
    // {
    //   name: "Ashutosh Gandhi",
    //   company: "CloudInstitute",
    //   experience: "3-5 years",
    //   img: "https://storage.googleapis.com/dc-profile-image/682ae220fb786cad8f5f5fa5-e033e7d8-d67f-46a9-b26c-dff70c97fe34.webp",
    // },
    // {
    //   name: "Nihal Kapoor",
    //   company: "Meta",
    //   experience: "8 years",
    //   img: "/mentors/m6.jpeg",
    // },
    // {
    //   name: "Rajiv Menon",
    //   company: "Amazon",
    //   experience: "7 years",
    //   img: "/mentors/m7.jpeg",
    // },
    // {
    //   name: "Bhavesh Kumar",
    //   company: "Netflix",
    //   experience: "6 years",
    //   img: "/mentors/m8.jpeg",
    // },
    // {
    //   name: "Sarthak Mehra",
    //   company: "Tesla",
    //   experience: "4 years",
    //   img: "/mentors/m9.jpeg",
    // },
  ];

  return (
    <div className="relative flex h-[670px] flex-col items-center justify-center px-6">
      {/* /Top Featured Mentors */}
      <img src="/bg11.png" alt="bg" className="absolute h-[100%] w-[100%]" />

      <div className="relative z-[50] pb-[-50px] pt-[100px]">
        <h1 className="mb-4 text-center text-2xl font-bold text-white md:text-5xl">
          Top Featured Mentors
        </h1>
        <p className="mb-8 text-center text-white">
          Get mentored by the best in the industry
        </p>
      </div>

      <div className="m-auto  relative w-[80%] items-center justify-center text-center">
        <h2 className="mb-4 text-xl font-extrabold tracking-wider text-white md:text-3xl">
          <TypewriterText text="Revealing Soon" />
        </h2>
        <p className="mt-4 text-xl text-white/90">
          Our exceptional mentors are on their way!
        </p>
        <div className="mt-6 flex justify-center space-x-3">
          <span className="inline-flex h-3 w-3 animate-ping rounded-full bg-white opacity-75"></span>
          <span className="inline-flex h-3 w-3 animate-ping rounded-full bg-white opacity-75 delay-75"></span>
          <span className="inline-flex h-3 w-3 animate-ping rounded-full bg-white opacity-75 delay-150"></span>
        </div>
      </div>
    </div>
  );
}

// Typewriter animation component
function TypewriterText({ text }: { text: string }) {
  const [displayText, setDisplayText] = React.useState("");

  React.useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 150);

    return () => clearInterval(typingInterval);
  }, [text]);

  return (
    <span 
      className="inline-block font-bold text-white"

    >
      {displayText}
    </span>
// Add this to your global CSS or use inline styles
// This adds a text shadow to make text more visible against any background
// Note: This CSS class is already applied directly in the TypewriterText component
  );
}