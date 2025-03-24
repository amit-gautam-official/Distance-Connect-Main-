
import React from 'react'
import TestiminialCard from './TestiminialCard'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import TestimonialCardDesk from './TestimonialCardDesk'

const Testimonials = () => {
  return (
    <div>
        <div className='lg:hidden mt-12 w-[80%] m-auto'>
            <div className='w-[148px] h-[40px] flex-shrink-0 bg-[#EDFB90] flex justify-center items-center mx-auto'>
                <div className='text-[#3D568F] text-center font-inter text-[20px] font-bold leading-[24px]'>
                Testimonials
                </div>
            </div>
            <div className='mt-6'>
            <Carousel className="w-[80%] m-auto ">
      <CarouselContent className="">
        <CarouselItem  >
                <TestiminialCard/>
        </CarouselItem>
        <CarouselItem  >
                <TestiminialCard/>
        </CarouselItem>
        <CarouselItem  >
                <TestiminialCard/>
        </CarouselItem>
        <CarouselItem  >
                <TestiminialCard/>
        </CarouselItem>
        <CarouselItem  >
                <TestiminialCard/>
        </CarouselItem>
        
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
            </div>
        </div>
<div className='hidden lg:block   py-32 border-y-[0.5px] border-[#3D568F]'>

        <div className='  w-[80%] m-auto'>
            <div className='text-[#27417D] text-center font-inter text-[36px] font-extrabold leading-[40px] tracking-normal'>
            What our students have to say
            </div>
            <div className='text-[#27417D] mt-1 text-center font-inter text-[15px] font-normal leading-[20px] tracking-normal'>
            Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit aliquam sit nullam.
            </div>
            <div className='mt-12'>
            <Carousel className=" m-auto pl-12 ">
      <CarouselContent className="">
        <CarouselItem  className="md:basis-1/2 xl:basis-1/3  ">
                <TestimonialCardDesk/>
        </CarouselItem>
        <CarouselItem  className="md:basis-1/2 xl:basis-1/3   ">
                <TestimonialCardDesk/>
        </CarouselItem>
        <CarouselItem  className="md:basis-1/2 xl:basis-1/3   ">
                <TestimonialCardDesk/>
        </CarouselItem>
        <CarouselItem  className="md:basis-1/2  xl:basis-1/3 ">
                <TestimonialCardDesk/>
        </CarouselItem>
        <CarouselItem  className="md:basis-1/2 xl:basis-1/3 ">
                <TestimonialCardDesk/>
        </CarouselItem>
        <CarouselItem  className="md:basis-1/2 xl:basis-1/3 ">
                <TestimonialCardDesk/>
        </CarouselItem>
        <CarouselItem  className="md:basis-1/2 xl:basis-1/3 ">
                <TestimonialCardDesk/>
        </CarouselItem>
        <CarouselItem  className="md:basis-1/2 xl:basis-1/3 ">
                <TestimonialCardDesk/>
        </CarouselItem>
        <CarouselItem  className="md:basis-1/2 xl:basis-1/3 ">
                <TestimonialCardDesk/>
        </CarouselItem>
        <CarouselItem  className="md:basis-1/2 xl:basis-1/3 ">
                <TestimonialCardDesk/>
        </CarouselItem>
       
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
            </div>
        </div>
</div>
    </div>
  )
}

export default Testimonials