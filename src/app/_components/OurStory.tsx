"use client"
import React, { useState } from 'react'

const OurStory = () => {

    const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div>
         <div className='w-[80%] m-auto  lg:hidden mt-12'>
            <div className='w-full h-[620px] flex flex-col justify-between  rounded-[30px] border border-black bg-[#9FBAF1]' >
            <div className='flex gap-4 px-6 pb-6 pt-10   items-center'> 
                <img src='/star.svg' className='w-[25px] h-[27px] flex-shrink-0' />
                <div className='text-[#EDFB90] font-inter text-[24px] font-semibold leading-[28px]'>Our Story</div>
             </div>

             
             
            
             <div className="max-w-md mx-auto  rounded-2xl p-6 relative">
     
      <p className="text-[#3D568F] font-inter text-[12px] font-normal leading-[19px]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.
      </p>
      <div className="relative overflow-hidden">
        <p className={`text-[#3D568F] font-inter text-[12px] font-normal leading-[19px] ${isExpanded ? 'opacity-100 max-h-96' : 'opacity-50 max-h-16'}`}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, incididunt ut labore et dolore magna ad minim veniam. Additional content here...
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, incididunt ut labore et dolore magna ad minim veniam. Additional content here...
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, incididunt ut labore et incididunt ut labore et dolore magna ad minim veniam. Additional content here...
        </p>
        {!isExpanded && <div className="absolute bottom-0 left-0 w-full h-10 "></div>}
      </div>
      <button 
        className="text-[#3D568F] font-inter text-[12px] font-normal leading-[19px]"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "Read Less" : "Read More"}
      </button>
             
           
             
            </div>
      <div className="my-6  flex justify-center">
        <img
          src="/ourstory.png"
          alt="Illustration"
          className="w-48"
        />
      </div>
    </div>
        </div>

        <div className='w-[80%]  flex-col  m-auto hidden lg:flex mt-[100px]'>

            <img src='/ourstoryDesk.png' alt='ourstory' className='w-[100%] h-[100%]'/>
            <div className='flex w-full gap-4'>
                <div className='w-[50%] flex gap-4 justify-center items-center'>
                    <div className='text-[#3D568F] font-inter text-[50px] font-bold leading-[32px]'>

                    Our Story
                    </div>
                    <div>
                        <img src='/arrow.svg' alt='arrow' className='w-[50px] h-[50px]'/>
                    </div>
                </div>
                <div className='w-[50%]'>
                <div className="max-w-md mx-auto mt-20 rounded-2xl p-6 relative">
     
     <p className="text-[#3D568F] font-inter text-[19px] font-normal leading-[24px]">
       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam.
     </p>
     <div className="relative overflow-hidden ">
       <p className={`text-[#3D568F] font-inter text-[19px] font-normal leading-[24px] ${isExpanded ? 'opacity-100 max-h-96' : 'opacity-50 max-h-16'}`}>
         Lorem ipsum dolor sit amet, consectetur adipiscing elit, incididunt ut labore et dolore magna ad minim veniam. Additional content here...
         Lorem ipsum dolor sit amet, consectetur adipiscing elit, incididunt ut labore et dolore magna ad minim veniam. Additional content here...
         Lorem ipsum dolor sit amet, consectetur adipiscing elit, incididunt ut labore et incididunt ut labore et dolore magna ad minim veniam. Additional content here...
       </p>
       {!isExpanded && <div className="absolute bottom-0 left-0 w-full h-10 "></div>}
     </div>
     <button 
       className="flex w-[96px] h-[32px] cursor-pointer mt-4 justify-center items-center shrink-0 rounded-[15px] bg-[#3D568F] text-white shadow-[0_1px_1px_rgba(0,0,0,0.08)]"
       onClick={() => setIsExpanded(!isExpanded)}
     >
       {isExpanded ? "Read Less" : "Read More"}
     </button>
            
          
            
           </div>
                </div>
            </div>

        </div>
    </div>
  )
}

export default OurStory