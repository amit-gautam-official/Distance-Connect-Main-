import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion'
import React from 'react'

const Faq = () => {
  return (
    <div>
       <div className='flex md:hidden  flex-col w-[80%] m-auto mt-10 gap-4 items-center'>
       <div className=' text-[#3D568F] text-center font-inter text-[28px] font-bold leading-[38px]'>
        Frequently Asked Questions
        </div>
        <div className='text-[#9795B5] text-center font-inter text-[16px] font-normal leading-[28px]'>
        Cras tincidunt lobortis feugiat vivamus at morbi leo urna molestie atole elementum
        </div>
        <div className='flex flex-col gap-4'>
        <Accordion className='flex flex-col gap-4' type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger className='w-[336px] h-[99px] flex-shrink-0 rounded-[15px] border border-[#D4D2E3] bg-white text-[#3D568F] font-inter text-[18px] font-bold leading-[24px] '>How do I create an account on the platform?

    </AccordionTrigger>
    <AccordionContent className=' w-[336px] text-[#9795B5] text-center font-dm-sans text-[16px] font-normal leading-[28px] rounded-[15px] border border-[#D4D2E3] bg-white p-4'>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt phasellus elit etiam cursus orci in. Id sed montes. 
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger className='w-[336px] h-[99px] flex-shrink-0 rounded-[15px] border border-[#D4D2E3] bg-white text-[#3D568F] font-inter text-[18px] font-bold leading-[24px] '>What kind of jobs and internships are available?

    </AccordionTrigger>
    <AccordionContent className=' w-[336px] text-[#9795B5] text-center font-dm-sans text-[16px] font-normal leading-[28px] rounded-[15px] border border-[#D4D2E3] bg-white p-4'>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt phasellus elit etiam cursus orci in. Id sed montes. 
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-3">
    <AccordionTrigger className='w-[336px] h-[99px] flex-shrink-0 rounded-[15px] border border-[#D4D2E3] bg-white text-[#3D568F] font-inter text-[18px] font-bold leading-[24px] '>How does the mentor matching process work?

    </AccordionTrigger>
    <AccordionContent className='w-[336px] text-[#9795B5] text-center font-dm-sans text-[16px] font-normal leading-[28px] rounded-[15px] border border-[#D4D2E3] bg-white p-4'>
    Our AI-driven system analyzes your interests, skills, and career goals to suggest the most suitable mentors. You can then connect with them for guidance and support. 
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-4">
    <AccordionTrigger className='w-[336px] h-[99px] flex-shrink-0 rounded-[15px] border border-[#D4D2E3] bg-white text-[#3D568F] font-inter text-[18px] font-bold leading-[24px] '>What kind of jobs and internships are available?

    </AccordionTrigger>
    <AccordionContent className='w-[336px] text-[#9795B5] text-center font-dm-sans text-[16px] font-normal leading-[28px] rounded-[15px] border border-[#D4D2E3] bg-white p-4'>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt phasellus elit etiam cursus orci in. Id sed montes. 
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-5">
    <AccordionTrigger className='w-[336px] h-[99px] flex-shrink-0 rounded-[15px] border border-[#D4D2E3] bg-white text-[#3D568F] font-inter text-[18px] font-bold leading-[24px] '> Who can join this platform?

    </AccordionTrigger>
    <AccordionContent className='w-[336px] text-[#9795B5] text-center font-dm-sans text-[16px] font-normal leading-[28px] rounded-[15px] border border-[#D4D2E3] bg-white p-4'>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt phasellus elit etiam cursus orci in. Id sed montes. 
    </AccordionContent>
  </AccordionItem>
</Accordion>
        </div>
        
       </div>


       <div className='w-[80%] m-auto mt-10  hidden md:block'>
        <div className='text-[#3D568F] text-center font-inter text-[36px] font-extrabold leading-[40px]'>
        Frequently Asked Questions
        </div>
        <div className='mt-6'>
        <Accordion className='grid lg:grid-cols-1 md:grid-cols-1  gap-6 ' type="single" collapsible>
    <AccordionItem value="item-1" className='flex flex-col justify-center items-center'>
        <AccordionTrigger className='flex w-full p-[20px_20px_20px_24px] flex-col items-start gap-2.5 rounded-[6px] border border-[#E1E4ED] bg-white shadow-[0px_0.5px_2px_0px_rgba(25,33,61,0.10)] text-[#3D568F] text-right font-inter text-[16px] font-semibold leading-[22px] '>How do I create an account on the platform?
        </AccordionTrigger>
        <AccordionContent className='text-[#7E8597] p-4 w-full font-inter text-[14px] font-normal leading-[22px] rounded-[6px] border border-[#B4B9C9] bg-[#FFF] shadow-[0px_1px_4px_0px_rgba(78,159,255,0.20)]'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt phasellus elit etiam cursus orci in. Id sed montes.
        </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-2" className='flex  flex-col justify-center items-center'>
          <AccordionTrigger className='flex w-full p-[20px_20px_20px_24px] flex-col items-start gap-2.5 rounded-[6px] border border-[#E1E4ED] bg-white shadow-[0px_0.5px_2px_0px_rgba(25,33,61,0.10)] text-[#3D568F] text-right font-inter text-[16px] font-semibold leading-[22px] '>What kind of jobs and internships are available?
        </AccordionTrigger>
        <AccordionContent className='text-[#7E8597] p-4 w-full font-inter text-[14px] font-normal leading-[22px] rounded-[6px] border border-[#B4B9C9] bg-[#FFF] shadow-[0px_1px_4px_0px_rgba(78,159,255,0.20)]'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt phasellus elit etiam cursus orci in. Id sed montes.
        </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-3" className='flex flex-col justify-center items-center'>
        <AccordionTrigger className='flex w-full p-[20px_20px_20px_24px] flex-col items-start gap-2.5 rounded-[6px] border border-[#E1E4ED] bg-white shadow-[0px_0.5px_2px_0px_rgba(25,33,61,0.10)] text-[#3D568F] text-right font-inter text-[16px] font-semibold leading-[22px] '>How does the mentor matching process work?  
        </AccordionTrigger>
        <AccordionContent className='text-[#7E8597] p-4 w-full font-inter text-[14px] font-normal leading-[22px] rounded-[6px] border border-[#B4B9C9] bg-[#FFF] shadow-[0px_1px_4px_0px_rgba(78,159,255,0.20)]'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt phasellus elit etiam cursus orci in. Id sed montes.
        </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-4" className='flex flex-col justify-center items-center'>
        <AccordionTrigger className='flex w-full p-[20px_20px_20px_24px] flex-col items-start gap-2.5 rounded-[6px] border border-[#E1E4ED] bg-white shadow-[0px_0.5px_2px_0px_rgba(25,33,61,0.10)] text-[#3D568F] text-right font-inter text-[16px] font-semibold leading-[22px] '>What kind of jobs and internships are available?
        </AccordionTrigger>
        <AccordionContent className='text-[#7E8597] p-4 w-full font-inter text-[14px] font-normal leading-[22px] rounded-[6px] border border-[#B4B9C9] bg-[#FFF] shadow-[0px_1px_4px_0px_rgba(78,159,255,0.20)]'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit id venenatis pretium risus euismod dictum egestas orci netus feugiat ut egestas ut sagittis tincidunt phasellus elit etiam cursus orci in. Id sed montes.
        </AccordionContent>
    </AccordionItem>
    </Accordion>
        </div>
       </div>
    </div>
  )
}

export default Faq