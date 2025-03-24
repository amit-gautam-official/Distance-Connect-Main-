import React from 'react'

const BlogCard = ({blog} : any) => {

  const blogDescription = blog.shortDescription;
  const blogTitle = blog.title;
  const blogCreatedAt = blog.publishedDate;
  const blogThumbnailImageUrl = blog.featuredImage.fields.file.url;
  const blogThumbnailImageFileName = blog.featuredImage.fields.title;



  return (
    <div className='flex md:w-[280px] md:h-[460px] lg:w-[355px] lg:h-[500px] p-6 flex-col justify-start gap-4 flex-shrink-0 rounded-[20px] bg-white shadow-[0px_0px_41.3px_16px_rgba(61,86,143,0.20)]'>
      
        <img alt={blogThumbnailImageFileName} src={blogThumbnailImageUrl} className='w-[307px] h-[229px] flex-shrink-0 rounded-md object-cover' />
        <div>
        <div className='text-[#9FBAF1] text-[13px] font-[Inter] font-semibold leading-[20px]'>{blogCreatedAt}</div>
        <div className='flex items-start gap-2'>
            <div className='text-black md:text-[18px] lg:text-[22px] font-[Inter] font-normal leading-[32px]'>{blogTitle}</div>
            <img src='/halfArrow.svg' className='mt-4' />
        </div>

        </div>
            <div className='text-black md:text-[10px]   lg:text-[13px] font-[Inter] font-normal lg:leading-[24px] mt-[-10px]'>{blogDescription}</div>
           
     
        
       
    </div>
  )
}

export default BlogCard