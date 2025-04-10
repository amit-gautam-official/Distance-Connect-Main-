"use client"
import { api } from '@/trpc/react';
import React from 'react'
import { useRouter } from 'next/navigation';
import { useMobile } from '@/hooks/use-mobile';



const HeroSection =() => {
  const router = useRouter();

  const isMobile = useMobile();


  return (
    <div className='xl:h-[650px]  relative '>

<div className='  flex lg:justify-start xl:flex-col flex-col xl:items-start m-auto w-[90%] xl:w-[70%] '>
    <div className='flex-col   gap-8  flex mt-[10px] xl:text-left text-center lg:mt-[180px] xl:mt-[220px] '>
        <h1 className='text-black font-inter text-[36px] md:text-[49px] not-italic font-bold leading-[50px] md:leading-[60px] '>  
        Turn Placement Stress {isMobile ? ' ' : <br/> } into Offer Letters with {isMobile ? ' ' : <br/> } 1:1 Career Guidance
        </h1>
        <h2 className='text-[#474747] font-inter text-[20px] md:text-[20px] not-italic font-light leading-[25px] md:leading-[32px]'>
        Our Mentors guides students step-by-step and <br/>
        prepares them for top placements
        </h2>
        <div className='flex gap-4 xl:justify-start justify-center w-full'>
          <button
          onClick={() => {
            router.push('/mentors');
          }}
           className='flex md:w-[199px] md:h-[50px] px-4 py-2 justify-center items-center gap-[10px] shrink-0 text-white font-roboto text-[19px] not-italic font-medium leading-[24px] rounded-[15px] bg-[#3D568F] hover:bg-[#334775] transition-all duration-300 shadow-md'>
        Try for free 
          </button>
          <button
          onClick={() => {
            router.push('/');
          }}
           className='flex md:w-[199px] md:h-[50px] px-4 py-2 justify-center items-center gap-[10px] shrink-0 text-[#3D568F] font-roboto text-[19px] not-italic font-medium leading-[24px] rounded-[15px] bg-white border border-[#3D568F]  shadow-md'>
        How to use it
          </button>
          
        </div>

    </div>
    <div className='hidden xl:block absolute bottom-[-34px] right-[-40px] h-full scale-90 justify-center items-center '>
      <img src="/hero.png" alt="bg" className="mt-12"/>
    </div>

    </div>
    <div className='xl:hidden flex w-full justify-center  h-full  '>
      <img src="/hero-mobile.jpeg" alt="bg" className="mt-12 "/>
    </div>

    </div>
  
  )
}

export default HeroSection