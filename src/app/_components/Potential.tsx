import React from 'react'

const Potential = () => {
  return (
    <div className='lg:block hidden'>
        <img src='/bg12.png' className='w-full ' />
        <div className='w-[80%] m-auto flex gap-4 py-12 '>
            <div className='w-[40%] border-[#3D568F] border-r '>
                <div className='text-[#3D568F] font-inter text-[17px] font-normal leading-normal'>
                Success Seekers Network
                </div>
                <div className='text-[#3D568F] font-inter text-[40px] font-semibold leading-[46px]'>
                Achieve More,
                <br/> Together
                </div>
            </div>
            <div className='w-[60%] flex ml-12 flex-col  gap-y-12'>
                <div className='text-[#3D568F] font-inter text-[18px] font-normal leading-[114%]'>
                Gain full access to personalized <br/> mentorship to transform your career.
                </div>
                <button className='text-white font-inter text-[19px] font-semibold leading-[46px] flex w-[251px] h-[54px] px-8 py-2 justify-center items-center gap-2 flex-shrink-0 rounded-[30px] bg-[#39DB21] shadow-md ' >
                Unlock All Features
                </button>

            </div>

        </div>

    </div>
  )
}

export default Potential