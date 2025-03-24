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
  return (
    <div className="relative h-[670px] px-6 flex justify-center items-center" >

        <img src="/bg11.png" alt="bg" className=" w-[100%] h-[100%] absolute"/>
    <Carousel className="w-[80%] m-auto ">
      <CarouselContent className="">
        <CarouselItem  className="md:basis-1/3 ">
                <MentorCard/>
        </CarouselItem>
        <CarouselItem  className="md:basis-1/3">
                <MentorCard/>
        </CarouselItem>
        <CarouselItem  className="md:basis-1/3">
                <MentorCard/>
        </CarouselItem>
        <CarouselItem  className="md:basis-1/3">
                <MentorCard/>
        </CarouselItem>
        <CarouselItem  className="md:basis-1/3">
                <MentorCard/>
        </CarouselItem>
        <CarouselItem  className="md:basis-1/3">
                <MentorCard/>
        </CarouselItem>
        <CarouselItem  className="md:basis-1/3">
                <MentorCard/>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </div>
  )
}
