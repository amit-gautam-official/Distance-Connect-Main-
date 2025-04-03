"use client"
import { api } from '@/trpc/react';
import React from 'react'
import { useRouter } from 'next/navigation';



const HeroSection =() => {
  const router = useRouter();


  return (
    <div className='lg:h-[640px]   flex flex-col m-auto  w-[80%] lg:flex-row '>
    <div className='flex-col  gap-8 lg:mt-[200px] lg:w-[70%] m-auto flex mt-12 items-center  '>
        <h1 className='text-center lg:text-left text-[#3D568F] lg:text-[52px] lg:leading-[63px] font-inter text-[32px] md:text-[40px] font-bold leading-[39px]'>
        Find Your Perfect Mentor- Unlock Opportunities
        </h1>
        <h2 className='text-center lg:text-left text-[#9795B5] font-inter text-[14px] lg:text-[24px] md:text-[20px] font-normal leading-[24px]'>
        Book your first free demo session and connect with professionals, gain insights, and achieve your goals
        </h2>
        <div className='flex gap-4 lg:justify-start justify-center w-full'>
          <button
          onClick={() => {
            router.push('/mentors');
          }}
           className='flex h-[42px] lg:w-[208px] lg:h-[50px] p-[18px_24px] justify-center items-center gap-4 self-stretch rounded-[30px] bg-[#3D568F] text-center font-inter text-[13px] lg:text-[19px] font-bold leading-[18px] text-white'>
          Book Free Demo
          </button>
          <button 
          onClick={() => {
            router.push('/solutions/mentor');
          }}
          className=' h-[42px] lg:w-[240px] lg:h-[50px] lg:text-[19px]  px-6  gap-2 self-stretch rounded-[30px] border border-[#D4D2E3] bg-white text-[#3D568F] text-center font-inter text-[13px] font-normal leading-[18px]'>
            Learn more
          </button>
        </div>

    </div>
    <div className='hidden  h-full  lg:flex justify-center items-center w-[30%]'>
      <img src="/bg1.png" alt="bg" className="mt-12"/>
    </div>

    </div>
  )
}

export default HeroSection