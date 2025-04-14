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
      name: "Lisa Nilon",
      company: "Microsoft",
      experience: "10 years",
      img: "/mentors/m1.jpeg",
    },
    {
      name: "Paarth Rathore",
      company: "Apple",
      experience: "5 years",
      img: "/mentors/m2.jpeg",
    },
    {
      name: "Rahul Sinha",
      company: "Boat",
      experience: "2 years",
      img: "/mentors/m3.jpeg",
    },
    {
      name: "Tanay Gupta",
      company: "Microsoft",
      experience: "5 years",
      img: "/mentors/m4.jpeg",
    },
    {
      name: "Siddharth Sharma",
      company: "Google",
      experience: "10 years",
      img: "/mentors/m5.jpeg",
    },
    {
      name: "Nihal Kapoor",
      company: "Meta",
      experience: "8 years",
      img: "/mentors/m6.jpeg",
    },
    {
      name: "Rajiv Menon",
      company: "Amazon",
      experience: "7 years",
      img: "/mentors/m7.jpeg",
    },
    {
      name: "Bhavesh Kumar",
      company: "Netflix",
      experience: "6 years",
      img: "/mentors/m8.jpeg",
    },
    {
      name: "Sarthak Mehra",
      company: "Tesla",
      experience: "4 years",
      img: "/mentors/m9.jpeg",
    },
   
  ];
  

  return (
    <div className="relative h-[670px] px-6 flex justify-center items-center" >

        <img src="/bg11.png" alt="bg" className=" w-[100%] h-[100%] absolute"/>
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
