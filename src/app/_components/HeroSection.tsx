"use ";
import { api } from "@/trpc/react";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import WaitlistModal from "./WaitlistModal";
import { useSession } from "next-auth/react";
import Link from "next/link";

const HeroSection = () => {
  const router = useRouter();
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = React.useState(false);
  const isMobile = useMobile();
   const session = useSession();
    
    const openWaitlistModal = () => {
      if (session.data) {
        return;
      }
      setIsWaitlistModalOpen(true);
    };

  return (
    <div className="relative xl:h-[650px]">
            <WaitlistModal
              isOpen={isWaitlistModalOpen}
              onClose={() => setIsWaitlistModalOpen(false)}
            />
      <div className="m-auto flex w-[90%] flex-col lg:justify-start xl:w-[80%] xl:flex-col xl:items-start">
        <div className="mt-[10px] flex flex-col gap-8 text-center lg:mt-[180px] xl:mt-[220px] xl:text-left">
          <h1 className="font-inter text-[36px] font-bold not-italic leading-[50px] text-black md:text-[49px] md:leading-[60px]">
            Turn Placement Stress {isMobile ? " " : <br />} into Offer Letters
            with {isMobile ? " " : <br />} 1:1 Career Guidance
          </h1>
          <h2 className="font-inter text-[20px] font-light not-italic leading-[25px] text-[#474747] md:text-[20px] md:leading-[32px]">
            Our Mentors guides students step-by-step and <br />
            prepares them for top placements
          </h2>
          <div className="flex w-full justify-center gap-4 xl:justify-start">
            {/* <button
              onClick={() => {
                router.push("/mentors");
              }}
              className="font-roboto flex shrink-0 items-center justify-center gap-[10px] rounded-[15px] bg-[#3D568F] px-4 py-2 text-[19px] font-medium not-italic leading-[24px] text-white shadow-md transition-all duration-300 hover:bg-[#334775] md:h-[50px] md:w-[199px]"
            >
              Try for free
            </button> */}
            
           {!session.data ?  <button
              onClick={openWaitlistModal}
              className="font-roboto flex shrink-0 items-center justify-center gap-[10px] rounded-[15px] bg-[#3D568F] px-4 py-2 text-[19px] font-medium not-italic leading-[24px] text-white shadow-md transition-all duration-300 hover:bg-[#334775] md:h-[50px] md:w-[199px]"
            >
              Join Waitlist
            </button> : 
            <Link
              href="/auth/login"
              className="font-roboto flex shrink-0 items-center justify-center gap-[10px] rounded-[15px] bg-[#3D568F] px-4 py-2 text-[19px] font-medium not-italic leading-[24px] text-white shadow-md transition-all duration-300 hover:bg-[#334775] md:h-[50px] md:w-[199px]"
            >
              Dashboard
            </Link>}
            <button
              onClick={() => {
                router.push("#roadmap");
              }}
              className="font-roboto flex shrink-0 items-center justify-center gap-[10px] rounded-[15px] border border-[#3D568F] bg-white px-4 py-2 text-[19px] font-medium not-italic leading-[24px] text-[#3D568F] shadow-md md:h-[50px] md:w-[199px]"
            >
              How to use it
            </button>
          </div>
        </div>
        <div className="absolute bottom-[-34px] right-[-40px] hidden h-full scale-90 items-center justify-center xl:block">
          <img src="/hero.png" alt="bg" className="mt-12" />
        </div>
      </div>
      <div className="flex h-full w-full justify-center xl:hidden">
        <img src="/hero-mobile.jpeg" alt="bg" className="mt-12" />
      </div>
    </div>
  );
};

export default HeroSection;
