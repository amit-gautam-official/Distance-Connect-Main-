import React from "react";

interface Testimonial {
  testimonial: string;
  name: string;
  designation: string;
  stars: number;
}

const TestiminialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="mx-auto flex h-[350px] w-[90%] flex-col rounded-lg bg-white p-6 shadow-md">
      <div className="mb-3 flex items-center">
        <div className="flex space-x-1">
          {[...Array(testimonial.stars)].map((_, i) => (
            <img
              alt="star"
              src="/testStar.svg"
              key={i}
              className="h-4 w-4 fill-current"
            />
          ))}
        </div>
      </div>
      <div className='mb-auto max-h-[180px] overflow-y-auto font-["DM_Sans"] text-[15px] font-normal leading-6 text-[#9795B5]'>
        &quot;{testimonial.testimonial}&quot;
      </div>
      <div className="mt-4 flex items-center gap-3">
        <img
          src="/test.jpg"
          className="h-[50px] w-[50px] flex-shrink-0 rounded-[12.5px]"
          alt="user"
        />
        <div>
          <div className="font-inter text-[12px] font-semibold text-[#3D568F]">
            {testimonial.name}
          </div>
          <div className="font-inter text-[10px] font-normal text-[var(--Neutral-Colors-Color-900,#8D8BA7)]">
            {testimonial.designation}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestiminialCard;
