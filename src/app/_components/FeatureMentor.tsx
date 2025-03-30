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
                experience: "10 years"
            },
            {
                name: "Paarth Rathore",
                company: "Apple",
                experience: "5 years"
            },
            {
                name: "Prachi Sinha",
                company: "Boat",
                experience: "2 years"
            },
            {
                name: "Wilsom trump",
                company: "Microsoft",
                experience: "5 years"
            },
            {
                name: "John Doe",
                company: "Google",
                experience: "10 years"
            }
        ]

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
