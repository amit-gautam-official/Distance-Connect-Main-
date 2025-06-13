import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import MentorCard from "./MentorCard"

export default function FeatureMentor() {

  const mentors = [
    {
      name: "Utkarsh Verma",
      company: "Maruti Suzuki India Limited",
      experience: "0-2  years",
      img: "https://storage.googleapis.com/dc-profile-image/6826d7d1fb786cad8f5f5f96-94341be2-8f93-4ce9-8439-cc0f8779e9f0.webp",
    },
    {
      name: "jitin trehan",
      company: "Phonepe",
      experience: "0-2 years",
      img: "https://storage.googleapis.com/dc-profile-image/682ec267fb786cad8f5f5fb1-4e36ad5a-0a1b-40ef-ad72-9ef38c44eec6.webp",
    },
    {
      name: "Mayank Tutwani",
      company: "Google",
      experience: "10+ years",
      img: "",
    },
    {
      name: "Akshit Singh",
      company: "Bharti Airtel Limited",
      experience: "6-10 years",
      img: "https://storage.googleapis.com/dc-profile-image/682ecc94fb786cad8f5f5fb8-5afaf9f0-d2f1-4d49-8247-a12f6ddedaa4.webp",
    },
    {
      name: "Ashutosh Gandhi",
      company: "CloudInstitute",
      experience: "3-5 years",
      img: "https://storage.googleapis.com/dc-profile-image/682ae220fb786cad8f5f5fa5-e033e7d8-d67f-46a9-b26c-dff70c97fe34.webp",
    },
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
    <div className="relative h-[670px] px-6 flex flex-col justify-center items-center" >
      {/* /Top Featured Mentors */}
        <img src="/bg11.png" alt="bg" className=" w-[100%] h-[100%] absolute"/>

      <div className="relative z-[50] pt-[100px] pb-[-50px]">
        <h1 className="text-2xl md:text-5xl font-bold text-center text-white mb-4">Top Featured Mentors</h1>
        <p className="text-center text-white mb-8">Get mentored by the best in the industry</p>
      </div>


    <Carousel className="w-[80%] m-auto ">
      <CarouselContent className="">
        {mentors.map((mentor) => (
            <CarouselItem key={mentor.name}  className="md:basis-1/3 ">
                <MentorCard mentor={mentor}/>
            </CarouselItem>
        ))}
        
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </div>
  )
}