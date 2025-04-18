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
        {/* <img
          src="/test.jpg"
          className="h-[50px] w-[50px] flex-shrink-0 rounded-[12.5px]"
          alt="user"
        /> */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
            <svg
              className="h-6 w-6 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z" />
            </svg>
          </div>
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
