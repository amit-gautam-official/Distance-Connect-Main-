import React from 'react'

const KeyBenefits = () => {
  return (
    <div>
        <div className='w-[80%] m-auto  lg:hidden'>
            <div className='w-full h-[620px]  rounded-[30px] border border-black bg-[#9FBAF1]' >
            <div className='flex gap-4 px-6 pb-6 pt-10   items-center'> 
                <img src='/star.svg' className='w-[25px] h-[27px] flex-shrink-0' />
                <div className='text-[#EDFB90] font-inter text-[24px] font-semibold leading-[28px]'>Key Benifits</div>
             </div>
             <div className='flex  flex-col mt-6 pl-[66px] pr-[40px] '>
                <img src='/plane.svg' className='w-[28px] h-[30px]' />
                <div className='text-[#3D568F] mt-4 font-inter text-[16px] font-medium leading-[18px]'>Personalized Career Growth</div>
                <div className='text-white font-inter text-[13px] font-normal leading-[18px]'>
                Lorem ipsum dolor sit amet consectetur eli mattis sit  sit nullam.
                </div>
             </div>
             <div className='flex mt-10 flex-col  pl-[66px] pr-[20px] '>
                <img src='/phome.svg' className='w-[28px] h-[30px] flex p-[6px_4px_4px_5px] flex-col justify-center items-center rounded-[8px] bg-[#F0F6FF]
' />
                <div className='text-[#3D568F] mt-4 font-inter text-[16px] font-medium leading-[18px]'>Personalized Career Growth</div>
                <div className='text-white font-inter text-[13px] font-normal leading-[18px]'>
                Lorem ipsum dolor sit amet consectetur eli mattis sit  sit nullam.
                </div>
             </div>
             <div className='flex mt-10 flex-col  pl-[66px] pr-[20px] '>
                <img src='/letter.svg' className=' h-[30px] flex w-[28px] p-[6px_4px_4px_5px] flex-col justify-center items-center rounded-[8px] bg-[#F0F6FF]' />
                <div className='text-[#3D568F] mt-4 font-inter text-[16px] font-medium leading-[18px]'>Personalized Career Growth</div>
                <div className='text-white font-inter text-[13px] font-normal leading-[18px]'>
                Lorem ipsum dolor sit amet consectetur eli mattis sit  sit nullam.
                </div>
             </div>
             
            </div>
        </div>
        <div className='w-[80%] m-auto hidden lg:block mt-[100px]'>
            <div className='w-full flex justify-center items-center gap-6'>
                <img src='/star.svg' className='w-[25px] h-[27px] flex-shrink-0' />
                <div className='text-center text-[#0052CC] font-inter text-[14px] font-medium leading-[20px]'>Our Features</div>
                <img src='/star.svg' className='w-[25px] h-[27px] flex-shrink-0' />

            </div>
            <div className='text-[#3D568F] text-center w-full mt-4 font-inter text-[36px] font-semibold leading-[44px]'>
            Our key benefits
            </div>
            <div className='text-[#3D568F] text-center font-inter text-[18px] font-normal leading-[28px] w-full '>
            Our services are designed to cater to your specific needs and goals
            </div>
            <div className='flex gap-6 mt-10'>
                <div className='w-[40%]'>
                <div className='flex  flex-col mt-12 pl-[66px] pr-[20px] '>
                <img src='/plane.svg' className='w-[40px] h-[40px]' />
                <div className='text-[#3D568F] mt-4 font-inter text-[20px] font-[600] leading-[28px]'>Personalized Career Growth</div>
                <div className='text-[#3D568F] font-inter text-[16px] font-normal leading-[24px]'>
                Lorem ipsum dolor sit amet consectetur eli mattis sit  sit nullam.
                </div>
             </div>
                <div className='flex  flex-col mt-12 pl-[66px] pr-[20px] '>
                <img src='/phome.svg' className='w-[40px] h-[40px] p-2 rounded-[12px] bg-[#F0F6FF] ' />
                <div className='text-[#3D568F]  mt-4 font-inter text-[20px] font-[600] leading-[28px]'>Personalized Career Growth</div>
                <div className='text-[#3D568F] font-inter text-[16px] font-normal leading-[24px]'>
                Lorem ipsum dolor sit amet consectetur eli mattis sit  sit nullam.
                </div>
             </div>
                <div className='flex  flex-col mt-12 pl-[66px] pr-[20px] '>
                <img src='/letter.svg' className='w-[40px] h-[40px] p-2  rounded-[12px] bg-[#F0F6FF]' />
                <div className='text-[#3D568F] mt-4 font-inter text-[20px] font-[600] leading-[28px]'>Personalized Career Growth</div>
                <div className='text-[#3D568F] font-inter text-[16px] font-normal leading-[24px]'>
                Lorem ipsum dolor sit amet consectetur eli mattis sit  sit nullam.
                </div>
             </div>
                </div>
                <div className='w-[60%]'>
                    <img src='/bg3.png' className='w-[642px] h-[664px] flex-shrink-0' />
                </div>

            </div>

        </div>
    </div>
  )
}

export default KeyBenefits