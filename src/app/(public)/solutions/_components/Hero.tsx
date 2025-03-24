import React from "react";

const Hero = ({title}:{title:string}) => {
  return (
    <div className="mx-auto flex w-[80%] gap-4">
      <div className="w-1/2 flex flex-col gap-4">
        <div className="font-inter text-5xl font-semibold leading-[46px] text-black">
         {title === "startup" && "Grow & manage your startup"}
         {title === "mentor" && "Get the best onboarding experience"}
         {title === "student" && "Get the best onboarding experience"}
        </div>
        <div className="font-inter text-[15px] font-normal leading-6 text-[#9795B5]">
         {title === "startup" && "Lorem ipsum dolor sit amet consectetur adipiscing elit nulla adipiscing tincidunt interdum tellus du."}
         {title === "mentor" && "Lorem ipsum dolor sit amet consectetur adipiscing elit nulla adipiscing tincidunt interdum tellus du."}
         {title === "student" && "Lorem ipsum dolor sit amet consectetur adipiscing elit nulla adipiscing tincidunt interdum tellus du."}
        </div>
        <div className="prose ml-4">
          {/* //list  */}
          <ul className="text-[#9795B5] font-inter text-sm font-normal leading-[21px]">
            {title === "startup" && <li>Lorem ipsum dolor sit ame</li>}
            {title === "mentor" && <li>nulla adipiscing tincidunt interdum tellus du</li>}
            {title === "student" && <li>onsectetur adipiscing elit</li>}
            {title === "startup" && <li>Lorem ipsum dolor sit ame</li>}
            {title === "mentor" && <li>nulla adipiscing tincidunt interdum tellus du</li>}
            {title === "student" && <li>onsectetur adipiscing elit</li>}
            {title === "startup" && <li>Lorem ipsum dolor sit ame</li>}
            {title === "mentor" && <li>nulla adipiscing tincidunt interdum tellus du</li>}
            {title === "student" && <li>onsectetur adipiscing elit</li>}
            {title === "student" && <li>onsectetur adipiscing elit</li>}
            {title === "startup" && <li>Lorem ipsum dolor sit ame</li>}
            {title === "mentor" && <li>nulla adipiscing tincidunt interdum tellus du</li>}
            {title === "student" && <li>onsectetur adipiscing elit</li>}
          </ul>
        </div>
        <button className="flex w-[135px] h-9 px-[18px] py-[2px] justify-center items-center gap-[10px] flex-shrink-0 rounded-[30px] bg-[#D9D9D9]">
            Get Started
        </button>
      </div>
      <div className="w-1/2">
        <img src={"/blog.jpg"} alt="hero" />
      </div>
    </div>
  );
};

export default Hero;
