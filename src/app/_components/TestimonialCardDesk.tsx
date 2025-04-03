import React from "react";

interface Testimonial {
  testimonial: string;
  name: string;
  designation: string;
  stars: number;
}

const TestimonialCardDesk = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div>
      <div className="flex h-[400px] w-[321px] flex-shrink-0 flex-col items-start justify-between gap-2 rounded-[8px] border border-[#C9D0E7] bg-white p-[24px] shadow-[0px_1px_4px_rgba(25,33,61,0.08)]">
        <div className="mb-4  flex items-center">
          <div className="flex space-x-1 text-blue-700">
            {[...Array(testimonial.stars)].map((_, i) => (
              <img
                alt="star"
                src="/testStar.svg"
                key={i}
                className="h-5 w-5 fill-current"
              />
            ))}
          </div>
        </div>
        <div className="mb-auto max-h-[220px] overflow-y-auto no-scrollbar">
          <p className="mb-4 italic text-gray-700 ">
            &quot;{testimonial?.testimonial}&quot;
          </p>
        </div>
        <div className="mt-4 flex items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
            <svg
              className="h-6 w-6 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="font-inter text-[17px] font-semibold leading-[22px] text-[#27417D]">
              {testimonial?.name}
            </p>
            <p className="font-inter text-[15px] font-normal leading-[20px] text-[#7979B9]">
              {testimonial?.designation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCardDesk;
