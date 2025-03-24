import React from 'react'

const MentorCard = () => {
  return (
    <div>
        <div className='flex flex-col justify-center items-center p-4 gap-4'>
            <img src="/mentor.jpg" className='w-[174px] h-[174px] object-cover rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.08)]'/>
            <div className='text-white font-inter text-[20px] font-semibold leading-[22px]'> 
                Mentor Name
            </div>
            <div className='flex flex-col gap-1'>

            <div className='text-white text-center font-inter text-[16px] font-medium leading-[21.44px]'>
                Mentor Company
            </div>
            <div className='text-white text-center font-inter text-[16px] font-medium leading-[21.44px]'>
                Mentor Experience
            </div>
            </div>
        </div>
    </div>
  )
}

export default MentorCard