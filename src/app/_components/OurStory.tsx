"use client";
import React, { useState } from "react";

const OurStory = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div>
      <div className="m-auto mt-12 w-[90%] lg:hidden">
        <div className="flex h-[620px] w-full flex-col justify-between rounded-[30px] border border-black bg-[#9FBAF1]">
          <div className="flex items-center gap-4 px-6 pb-6 pt-10">
            <img src="/star.svg" className="h-[27px] w-[25px] flex-shrink-0" />
            <div className="font-inter text-[24px] font-semibold leading-[28px] text-[#EDFB90]">
              Our Story
            </div>
          </div>

          <div className="relative mx-auto max-w-md rounded-2xl p-6">
            <p className="font-inter text-[12px] font-normal leading-[19px] text-[#3D568F]">
              We started Distance Connect because we faced the same struggles as
              many students—no proper guidance, no industry exposure, and no
              clear path, Just hit and trial.
            </p>
            <div className="relative overflow-hidden">
              <p
                className={`font-inter text-[12px] font-normal leading-[19px] text-[#3D568F] ${isExpanded ? "max-h-96 opacity-100" : "max-h-16 opacity-50"}`}
              >
                We saw how tough it was, especially for students from smaller
                colleges, to find the right opportunities. So, we built Distance
                Connect to help students connect with mentors, learn real-world
                skills, and get better job opportunities easier. What began as a
                small team with a big dream is now a growing company. Our goal
                is simple—make career growth easier for every student. And this
                is just the beginning! 🚀
              </p>
              {!isExpanded && (
                <div className="absolute bottom-0 left-0 h-10 w-full"></div>
              )}
            </div>
            <button
              className="font-inter text-[12px] font-normal leading-[19px] bg-[#EDFB90] rounded-sm px-1 text-[#3D568F]"
              onClick={() => setIsExpanded(!isExpanded)} 
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          </div>
          <div className="my-6 flex justify-center">
            <img src="/ourstory.png" alt="Illustration" className="w-48" />
          </div>
        </div>
      </div>

      <div className="m-auto mt-[100px] hidden w-[80%] flex-col lg:flex">
        <img
          src="/ourstoryDesk.png"
          alt="ourstory"
          className="h-[100%] w-[100%]"
        />
        <div className="flex w-full gap-4">
          <div className="flex w-[50%] items-center justify-center gap-4">
            <div className="font-inter text-[50px] font-bold leading-[32px] text-[#3D568F]">
              Our Story
            </div>
            <div>
              <img src="/arrow.svg" alt="arrow" className="h-[50px] w-[50px]" />
            </div>
          </div>
          <div className="w-[50%]">
            <div className="relative mx-auto mt-20 max-w-md rounded-2xl p-6">
              <p className="font-inter text-[19px] font-normal leading-[24px] text-[#3D568F]">
                We started Distance Connect because we faced the same struggles
                as many students—no proper guidance, no industry exposure, and
                no clear path, Just hit and trial.
              </p>
              <div className="relative overflow-hidden">
                <p
                  className={`font-inter text-[19px] font-normal leading-[24px] text-[#3D568F] ${isExpanded ? "max-h-96 opacity-100" : "max-h-16 opacity-50"}`}
                >
                  We saw how tough it was, especially for students from smaller
                  colleges, to find the right opportunities. So, we built
                  Distance Connect to help students connect with mentors, learn
                  real-world skills, and get better job opportunities easier.
                  What began as a small team with a big dream is now a growing
                  company. Our goal is simple—make career growth easier for
                  every student. And this is just the beginning! 🚀
                </p>
                {!isExpanded && (
                  <div className="absolute bottom-0 left-0 h-10 w-full"></div>
                )}
              </div>
              <button
                className="mt-4 flex h-[32px] w-[96px] shrink-0 cursor-pointer items-center justify-center rounded-[15px] bg-[#3D568F] text-white shadow-[0_1px_1px_rgba(0,0,0,0.08)]"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Read Less" : "Read More"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurStory;
