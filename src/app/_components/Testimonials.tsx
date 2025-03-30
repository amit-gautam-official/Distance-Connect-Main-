
import React from 'react'
import TestiminialCard from './TestiminialCard'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import TestimonialCardDesk from './TestimonialCardDesk'

const Testimonials = () => {

        const testimonials = [
                {
                        testimonial: "This platform has been a game-changer for my career. The mentorship and job opportunities helped me land my dream role!",
                        name: "Brian Clark",
                        designation: "CEO & Founder",
                        stars: 5,
                },
                {
                        testimonial: "I've been able to connect with mentors who provided valuable insights and guidance. The platform is user-friendly and has a great community of learners.",
                        name: "Sarah Johnson",
                        designation: "Software Engineer",
                        stars: 4,
                },
                {
                                testimonial: "The platform's resources and community support have been instrumental in my professional growth. I highly recommend it to everyone.",
                        name: "Michael Brown",
                        designation: "Marketing Manager",
                        stars: 3,
                },
                {
                        testimonial: "The platform's resources and community support have been instrumental in my professional growth. I highly recommend it to everyone.",
                        name: "Emily Davis",
                        designation: "HR Manager",
                        stars: 5,
                },
                {
                        testimonial: "The platform's resources and community support have been instrumental in my professional growth. I highly recommend it to everyone.",
                        name: "John Smith",
                        designation: "Product Manager",     
                        stars: 5,
                },
                {
                        testimonial: "The platform's resources and community support have been instrumental in my professional growth. I highly recommend it to everyone.",
                        name: "Sarah Johnson",
                        designation: "Software Engineer",
                        stars: 4,
                },

        ]
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
        {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                        <TestiminialCard testimonial={testimonial}/>
                </CarouselItem>
        ))}
        
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

        {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 xl:basis-1/3  ">
              <TestimonialCardDesk testimonial={testimonial}/>
      </CarouselItem>
        ))}
       
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