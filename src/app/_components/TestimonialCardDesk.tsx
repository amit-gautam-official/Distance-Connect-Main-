import React from 'react'

const TestimonialCardDesk = () => {
  return (
    <div>
      <div className="flex flex-col items-start gap-2.5 w-[321px] h-[292px] p-[24px_24px_27px_24px] rounded-[8px] border border-[#C9D0E7] bg-white shadow-[0px_1px_4px_rgba(25,33,61,0.08)] flex-shrink-0 justify-between">
      <div className="flex items-center mb-4">
        <div className="flex space-x-1 text-blue-700">
          {[...Array(5)].map((_, i) => (
            <img alt='star' src='/testStar.svg' key={i} className="w-5 h-5 fill-current"/>
          ))}
        </div>
      </div>
      <p className="text-gray-700 italic">
        “Lorem ipsum dolor sit amet dolor sit consectetur eget maecenas sapien
        fusce egestas rist onare”
      </p>
     <div className='w-full flex justify-end mt-[-20px]'>
     <img src='colon.svg' className='w-[50px] h-[50px] flex-col items-start gap-[10px] flex-shrink-0' alt="" />
     </div>
      <div className="flex items-center mt-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-[#27417D] font-inter text-[17px] font-semibold leading-[22px]  ">Brian Clark</p>
          <p className="text-[#7979B9] font-inter text-[15px] font-normal leading-[20px]">CEO & Founder</p>
        </div>
      </div>
    </div>
    </div>
  )
}

export default TestimonialCardDesk