import React from 'react'

interface Mentor {
    name: string;
    company: string;
    experience: string;
    img: string;
}

const MentorCard = ({mentor}: {mentor: Mentor}) => {
  return (
    <div>
        <div className='flex flex-col justify-center items-center p-4 gap-4'>
            {mentor?.img ?  <img src={mentor?.img} className='w-[174px] h-[174px] object-cover object-top rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.08)]'/>  : 
            //initial letter with a blue background
            <div className='w-[174px] h-[174px] bg-blue-500 flex items-center justify-center rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.08)]'>
                <span className='text-white text-4xl font-bold'>{mentor.name.charAt(0)}</span>
            </div>
            }
            <div className='text-white font-inter text-[20px] font-semibold leading-[22px]'> 
                {mentor.name}
            </div>
            <div className='flex flex-col gap-1'>

            <div className='text-white text-center font-inter text-[16px] font-medium leading-[21.44px]'>
                {mentor.company}
            </div>
            <div className='text-white text-center font-inter text-[16px] font-medium leading-[21.44px]'>
                {mentor.experience}
            </div>
            </div>
        </div>
    </div>
  )
}

export default MentorCard