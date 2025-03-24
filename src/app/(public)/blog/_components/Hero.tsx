import React from 'react'

const Hero = ({blog} : any) => {
 
  console.log(blog.fields?.slug)
  const blogThumbnailImageUrl = blog.fields.featuredImage.fields.file.url;
  const blogThumbnailImageFileName = blog.fields.featuredImage.fields.title;
  const blogTitle = blog.fields.title;
  const blogDescription = blog.fields.shortDescription;
  const blogCreatedAt = blog.fields.publishedDate;

  return (
    <div>
         <img src={blogThumbnailImageUrl} alt={blogThumbnailImageFileName} className="xl:rounded-[46px] rounded-[15px] md:rounded-[20px] object-cover m-auto w-[80%] xl:w-[1106px] xl:h-[640px] " />
         
         <div className='xl:w-[993px] w-[75%] m-auto mt-[-100px] md:mt-[-150px] xl:h-[200px] relative z-[100] p-4 md:p-6 flex-shrink-0 rounded-[15px] md:rounded-[20px] bg-white'>
          <div className='text-[#9FBAF1] mt-2 leading-[normal] text-[12px] md:text-[16px] font-[Inter] font-[400] tracking-[0.48px]'>{blogCreatedAt}</div>
          <div className='text-[#0E0D0F] mt-2 font-inter text-[20px] md:text-[32px] font-normal leading-normal tracking-[0.96px]'>{blogTitle}</div>
          <div className='text-[#3D568F] mt-2 text-[12px] md:text-[18px] font-[Nunito] font-[400] leading-[150%] tracking-[0.5px]'>{blogDescription}</div>
         </div>
    </div>
  )
}

export default Hero