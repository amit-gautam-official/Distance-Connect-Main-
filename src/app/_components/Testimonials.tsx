import React from "react";
import TestiminialCard from "./TestiminialCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TestimonialCardDesk from "./TestimonialCardDesk";

const Testimonials = () => {
  const testimonials = [
    {
      testimonial:
        "Distance Connect completely changed the way I approached placements. The mentors here helped me understand what companies really look for. I built my resume, practiced interviews, and landed an internship at a great company. I wouldn't have done it without this platform!",
      name: "Rohan Sharma",
      designation: "Computer Science Student",
      stars: 5,
    },
    {
      testimonial:
        "Honestly, I didn't know what to do in college. Everyone talked about coding, but I wasn't even sure if that was for me. Through Distance Connect, I found a mentor who introduced me to UI/UX design, and now I love it! Best decision ever!",
      name: "Ananya Verma",
      designation: "2nd Year Student",
      stars: 5,
    },
    {
      testimonial:
        "I always felt lost when it came to internships. There were so many options, but I didn't know what was right for me. My mentor on Distance Connect guided me step by step, and now I have real industry experience before even graduating.",
      name: "Mohit Patel",
      designation: "Electronics Engineering Student",
      stars: 5,
    },
    {
      testimonial:
        "I was nervous about talking to professionals, but the mentors here are so chill! They actually listen, give practical advice, and don't make you feel dumb for asking basic questions. Love the vibe of this platform!",
      name: "Priya Sen",
      designation: "BBA Student",
      stars: 5,
    },
    {
      testimonial:
        "Coming from a Tier 3 college, I always felt like I had fewer opportunities. Distance Connect made me realize that with the right guidance, I can still make it big. The mentorship and job preparation resources here are priceless!",
      name: "Arjun Mehta",
      designation: "Mechanical Engineering Student",
      stars: 5,
    },
    {
      testimonial:
        "Before joining Distance Connect, I was unsure about my career path. My mentor not only helped me choose the right domain but also gave me confidence in my skills. Now, I feel ready to face interviews and secure my dream job!",
      name: "Ishita Malhotra",
      designation: "Final Year CS Student",
      stars: 5,
    },
    {
      testimonial:
        "Bro, I was so lost about what to do after college. Should I do coding? Should I go for an MBA? But thanks to my mentor, I finally have clarity. This platform is like having a career cheat code!",
      name: "Ravi Yadav",
      designation: "3rd Year Mechanical Student",
      stars: 5,
    },
    {
      testimonial:
        "Placements used to scare me because I didn't know what companies expected. But after mock interviews and expert guidance on Distance Connect, I feel fully prepared. I now approach job applications with confidence!",
      name: "Sanya Kapoor",
      designation: "Electrical Engineering Student",
      stars: 5,
    },
    {
      testimonial:
        "College teaches you theory, but Distance Connect teaches you how to actually get a job. My mentor helped me build a solid portfolio, and now I have recruiters reaching out to me!",
      name: "Harsh Gupta",
      designation: "IT Student",
      stars: 5,
    },
    {
      testimonial:
        "I never knew how important networking and real-world skills were until I joined Distance Connect. Learning from professionals who work in the industry has completely changed my approach to career growth!",
      name: "Meenal Choudhary",
      designation: "Marketing Student",
      stars: 5,
    },
  ];
  return (
    <div>
      <div className="m-auto mt-12 w-[90%] lg:hidden">
        <div className="mx-auto flex h-[40px] w-[148px] flex-shrink-0 items-center justify-center bg-[#EDFB90]">
          <div className="text-center font-inter text-[20px] font-bold leading-[24px] text-[#3D568F]">
            Testimonials
          </div>
        </div>
        <div className="mb-12 mt-8">
          <Carousel className="m-auto w-full">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="px-2">
                  <TestiminialCard testimonial={testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-4 flex justify-center gap-2">
              <CarouselPrevious className="static mx-1 transform-none" />
              <CarouselNext className="static mx-1 transform-none" />
            </div>
          </Carousel>
        </div>
      </div>
      <div className="hidden border-y-[0.5px] border-[#3D568F] py-32 lg:block">
        <div className="m-auto w-[90%]">
          <div className="text-center font-inter text-[36px] font-extrabold leading-[40px] tracking-normal text-[#27417D]">
            Student Testimonials
          </div>
          <div className="mb-8 mt-1 text-center font-inter text-[15px] font-normal leading-[20px] tracking-normal text-[#27417D]">
            Real stories from students who&apos;ve transformed their careers
            with Distance Connect
          </div>
          <div className="mt-16">
            <Carousel className="m-auto">
              <CarouselContent className="-ml-4 md:-ml-6">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-4 md:basis-1/2 md:pl-6 lg:basis-1/3"
                  >
                    <div className="h-full p-1">
                      <TestimonialCardDesk testimonial={testimonial} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="mt-8 flex justify-center gap-4">
                <CarouselPrevious className="static mx-2 transform-none" />
                <CarouselNext className="static mx-2 transform-none" />
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
