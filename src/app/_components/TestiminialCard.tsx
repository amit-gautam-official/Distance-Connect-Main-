import React from 'react'

interface Testimonial {
    testimonial: string;
    name: string;
    designation: string;
    stars: number;
}

const TestiminialCard = ({testimonial}: {testimonial: Testimonial}) => {
  return (
    <div className='w-[80%] m-auto'>
        <div className='text-center text-[#9795B5] font-["DM_Sans"] text-[15px] font-normal leading-6'>
        {testimonial.testimonial}
        </div>
        <div className='flex flex-col justify-center items-center gap-4 mt-4'>
            <img src="/test.jpg" className='rounded-[12.5px]  flex w-[50px] h-[50px] flex-col items-start gap-[10px] flex-shrink-0' alt="" />
            <div className='text-[#3D568F] text-center font-inter text-[12px] font-semibold leading-[24px] tracking-normal'>
            {testimonial.name}
            </div>
            <div className='text-[var(--Neutral-Colors-Color-900,#8D8BA7)] text-center font-inter text-[10px] font-normal leading-[18px] tracking-normal'>
            {testimonial.designation}
            </div>
        </div>
    </div>
  )
}

export default TestiminialCard