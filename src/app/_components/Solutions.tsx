import Link from "next/link";
import React from "react";

const Solutions = () => {
  return (
    <div className="relative mx-auto mt-20 flex w-[80%] flex-col items-center justify-center overflow-visible">
      {/* mobile section */}
      <div className="lg:hidden">
        <div className="relative">
          <div className="absolute left-[-25px] top-[-20px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
            >
              <path
                d="M12.5311 1.26725C12.6922 0.831944 13.3078 0.831944 13.4689 1.26725L16.4314 9.2732C16.482 9.41006 16.5899 9.51796 16.7268 9.56861L24.7327 12.5311C25.1681 12.6922 25.1681 13.3078 24.7327 13.4689L16.7268 16.4314C16.5899 16.482 16.482 16.5899 16.4314 16.7268L13.4689 24.7327C13.3078 25.1681 12.6922 25.1681 12.5311 24.7327L9.56861 16.7268C9.51796 16.5899 9.41006 16.482 9.2732 16.4314L1.26725 13.4689C0.831944 13.3078 0.831944 12.6922 1.26725 12.5311L9.2732 9.56861C9.41006 9.51796 9.51796 9.41006 9.56861 9.2732L12.5311 1.26725Z"
                fill="#9FBAF1"
              />
            </svg>
          </div>
          <div className="h-[36px] w-[219px] flex-shrink-0 bg-[#EDFB90] text-center font-inter text-[30px] font-bold leading-[36px] text-[#3D568F]">
            Our solutions
          </div>
          <div className="absolute right-[-30px] top-[-40px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="49"
              height="49"
              viewBox="0 0 49 49"
              fill="none"
            >
              <path
                d="M30.1309 42.3115C30.6909 43.3353 31.8415 45.7033 31.9636 46.9853"
                stroke="#3D568F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M33.1855 38.5723C37.1057 40.1747 45.282 44.1273 46.626 47.1185"
                stroke="#3D568F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1.56933 1.45013C4.47125 2.25134 10.2751 5.21583 10.2751 10.6641M10.2751 10.6641C7.5259 11.2872 2.85229 13.1745 6.15131 15.7384C7.16952 16.228 9.41978 15.8987 10.2751 10.6641ZM10.2751 10.6641C16.028 8.8836 27.656 8.23373 28.1448 19.878C27.8393 24.5517 26.4647 34.9408 23.4101 39.1071C27.0247 34.4779 37.0033 24.8455 48 23.3499M1.84023 4.54275L1 1L5.13712 1.08445"
                stroke="#3D568F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M11.0391 1.5835C12.21 1.9841 14.3992 3.42628 13.7882 5.99016"
                stroke="#3D568F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            
          </div>
        </div>
      </div>



      <div className="mt-4 text-center font-inter text-[16px] font-normal leading-[24px] text-[#3D568F] lg:hidden">
      Unlock opportunities with expert guidance tailored to your goals.
      </div>

      <div className="relative mt-10 flex flex-col items-center gap-4 lg:hidden">
        <img
          src="/bg4.jpg"
          className="relative z-[10] h-[369px] w-[336px] rounded-sm object-cover"
          alt="bg5"
        />
        <div className="relative z-[100] mt-[-120px] h-[228px] w-[326px] rounded-[8px] border border-[#E1E4ED] bg-[#FFF] p-8 shadow-md">
          <div className="font-inter text-[22px] font-bold leading-[32px] text-[#3D568F]">
            Student & Beginners
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="13"
                viewBox="0 0 15 13"
                fill="none"
              >
                <path
                  d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                  fill="#0AC1A7"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
            <div className="font-inter text-[12px] font-normal leading-[24px] text-[#3D568F]">
            Personalized guidance
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="13"
                viewBox="0 0 15 13"
                fill="none"
              >
                <path
                  d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                  fill="#0AC1A7"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
            <div className="font-inter text-[12px] font-normal leading-[24px] text-[#3D568F]">
            Resume & CV review
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="13"
                viewBox="0 0 15 13"
                fill="none"
              >
                <path
                  d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                  fill="#0AC1A7"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
            <div className="font-inter text-[12px] font-normal leading-[24px] text-[#3D568F]">
            Internship & Job opportunities
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="13"
                viewBox="0 0 15 13"
                fill="none"
              >
                <path
                  d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                  fill="#0AC1A7"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
            <div className="font-inter text-[12px] font-normal leading-[24px] text-[#3D568F]">
            Networking strategies
            </div>
          </div>
          
         

          <div className="mt-2 flex items-center gap-2 text-center font-inter text-[16px] font-semibold leading-[22px] text-[#3D568F]">
            <Link href="/solutions/student">Learn more</Link>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
              >
                <path
                  d="M6.35547 1.35107L11.7497 6.50008L6.35547 11.6491"
                  stroke="#3D568F"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.7499 6.5L1.25 6.5"
                  stroke="#3D568F"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="relative mt-10 flex flex-col items-center gap-4 lg:hidden">
        <img
          src="/bg6.jpg"
          className="relative z-[10] h-[369px] w-[336px] rounded-sm object-cover"
          alt="bg5"
        />
        <div className="relative z-[100] mt-[-120px] h-[228px] w-[326px] rounded-[8px] border border-[#E1E4ED] bg-[#FFF] p-8 shadow-md">
          <div className="font-inter text-[22px] font-bold leading-[32px] text-[#3D568F]">
            Startups
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="13"
                viewBox="0 0 15 13"
                fill="none"
              >
                <path
                  d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                  fill="#0AC1A7"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
            <div className="font-inter text-[12px] font-normal leading-[24px] text-[#3D568F]">
            Market research insights
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="13"
                viewBox="0 0 15 13"
                fill="none"
              >
                <path
                  d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                  fill="#0AC1A7"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
            <div className="font-inter text-[12px] font-normal leading-[24px] text-[#3D568F]">
            Pitch deck & Funding guidance
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="13"
                viewBox="0 0 15 13"
                fill="none"
              >
                <path
                  d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                  fill="#0AC1A7"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
            <div className="font-inter text-[12px] font-normal leading-[24px] text-[#3D568F]">
            Scaling & growth strategies 
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="13"
                viewBox="0 0 15 13"
                fill="none"
              >
                <path
                  d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                  fill="#0AC1A7"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
            <div className="font-inter text-[12px] font-normal leading-[24px] text-[#3D568F]">
              Personalized solutions
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="13"
                viewBox="0 0 15 13"
                fill="none"
              >
                <path
                  d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                  fill="#0AC1A7"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
            <div className="font-inter text-[12px] font-normal leading-[24px] text-[#3D568F]">
            Networking strategies
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2 text-center font-inter text-[16px] font-semibold leading-[22px] text-[#3D568F]">
            <Link href="/solutions/startup">Learn more</Link>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
              >
                <path
                  d="M6.35547 1.35107L11.7497 6.50008L6.35547 11.6491"
                  stroke="#3D568F"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.7499 6.5L1.25 6.5"
                  stroke="#3D568F"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="relative mt-10 flex flex-col items-center gap-4 lg:hidden">
        <img
          src="/bg7.jpg"
          className="relative z-[10] h-[369px] w-[336px] rounded-sm object-cover"
          alt="bg5"
        />
        <div className="relative z-[100] mt-[-120px] h-[228px] w-[326px] rounded-[8px] border border-[#E1E4ED] bg-[#FFF] p-8 shadow-md">
          <div className="font-inter text-[22px] font-bold leading-[32px] text-[#3D568F]">
          Mentors
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="13"
                viewBox="0 0 15 13"
                fill="none"
              >
                <path
                  d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                  fill="#0AC1A7"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
            <div className="font-inter text-[12px] font-normal leading-[24px] text-[#3D568F]">
              Flexible scheduling
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="13"
                viewBox="0 0 15 13"
                fill="none"
              >
                <path
                  d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                  fill="#0AC1A7"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
            <div className="font-inter text-[12px] font-normal leading-[24px] text-[#3D568F]">
            Set your own rates
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="13"
                viewBox="0 0 15 13"
                fill="none"
              >
                <path
                  d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                  fill="#0AC1A7"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
            <div className="font-inter text-[12px] font-normal leading-[24px] text-[#3D568F]">
            Expand your network
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="13"
                viewBox="0 0 15 13"
                fill="none"
              >
                <path
                  d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                  fill="#0AC1A7"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </svg>
            </div>
            <div className="font-inter text-[12px] font-normal leading-[24px] text-[#3D568F]">
            Gain Industry Recognition
            </div>
          </div>
         

          <div className="mt-2 flex items-center gap-2 text-center font-inter text-[16px] font-semibold leading-[22px] text-[#3D568F]">
            <Link href="/solutions/mentor">Learn more</Link>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
              >
                <path
                  d="M6.35547 1.35107L11.7497 6.50008L6.35547 11.6491"
                  stroke="#3D568F"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11.7499 6.5L1.25 6.5"
                  stroke="#3D568F"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* desktop section */}
      <div className="lg:flex h-[610px] hidden  w-full flex-shrink-0 rounded-[30px] bg-[linear-gradient(0deg,#FFFDEB_0%,#FFFDEB_100%),conic-gradient(from_196deg_at_78.23%_63.56%,rgba(245,246,255,0)_0deg,rgba(197,192,216,0)_360deg)]">
        <div className="flex w-[50%] flex-col gap-4 px-[68px] pt-[60px]">
          <button className="h-[30px] w-[98px] flex-shrink-0 rounded-[20px] border border-white bg-[rgba(246,212,207,0.30)] font-inter text-[12px] font-medium leading-[110%] text-black backdrop-blur-[25px]">
            Student
          </button>
          <div className="font-roboto text-[42px] font-bold leading-[110%] text-[#3D568F]">
            Students & Beginners
          </div>
          <div className="font-inter text-[16px] font-normal leading-[125%] text-[#3D568F]">
            Designed for students and early professionals to build strong career foundations with expert guidance.

          </div>
          <div className="flex flex-col gap-2">
            <div className="mt-2 flex items-center gap-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="13"
                  viewBox="0 0 15 13"
                  fill="none"
                >
                  <path
                    d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                    fill="#0AC1A7"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
              <div className="font-inter lg:text-[15px] xl:text-[20px] font-normal leading-[100%] text-[#3D568F]">
              Skill development
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="13"
                  viewBox="0 0 15 13"
                  fill="none"
                >
                  <path
                    d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                    fill="#0AC1A7"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
              <div className="font-inter lg:text-[15px] xl:text-[20px] font-normal leading-[100%] text-[#3D568F]">
                Personalized career guidance
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="13"
                  viewBox="0 0 15 13"
                  fill="none"
                >
                  <path
                    d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                    fill="#0AC1A7"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
              <div className="font-inter lg:text-[15px] xl:text-[20px] font-normal leading-[100%] text-[#3D568F]">
                Resume/CV review
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="13"
                  viewBox="0 0 15 13"
                  fill="none"
                >
                  <path
                    d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                    fill="#0AC1A7"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
              <div className="font-inter lg:text-[15px] xl:text-[20px] font-normal leading-[100%] text-[#3D568F]">
                Internship & Job opportunities
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="13"
                  viewBox="0 0 15 13"
                  fill="none"
                >
                  <path
                    d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                    fill="#0AC1A7"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
              <div className="font-inter lg:text-[15px] xl:text-[20px] font-normal leading-[100%] text-[#3D568F]">
                Job interview preparation
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="13"
                  viewBox="0 0 15 13"
                  fill="none"
                >
                  <path
                    d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                    fill="#0AC1A7"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
              <div className="font-inter lg:text-[15px] xl:text-[20px] font-normal leading-[100%] text-[#3D568F]">
                Networking strategies
              </div>
            </div>
          </div>
          <button className="relative z-[40] mt-6 h-[45px] w-[183px] flex-shrink-0 rounded-[30px] bg-[#3D568F] font-inter text-[18px] font-medium leading-[110%] text-white">
            <Link href="/solutions/student">Learn more</Link>
          </button>
        </div>
        <div className="flex w-[50%] flex-col items-center justify-center">
          <img
            src="/bg8.png"
            className="relative z-[40] h-[100%] w-[100%] rounded-[30px] object-cover"
            alt="bg8"
          />
        </div>
      </div>
      <div className="lg:flex hidden h-[564px] w-full flex-shrink-0">
        <div className="relative flex w-[50%] flex-col items-center justify-center">
          <div className="absolute right-[-50px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="665"
              height="380"
              viewBox="0 0 665 380"
              fill="none"
            >
              <path
                d="M665 127.5C665 266.952 516.135 380 332.5 380C148.865 380 0 266.952 0 127.5C0 -11.9519 148.865 -125 332.5 -125C516.135 -125 665 -11.9519 665 127.5Z"
                fill="url(#paint0_radial_2458_5008)"
              />
              <defs>
                <radialGradient
                  id="paint0_radial_2458_5008"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(306.671 225.242) rotate(81.0309) scale(169.023 220.441)"
                >
                  <stop stopColor="#DFEBF5" />
                  <stop offset="1" stopColor="#DFEBF9" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>
          <div className="absolute left-[-50px]"><img src="/grad.svg" /></div>

          <img
            src="/bg9.png"
            className="relative z-[40] h-[100%] w-[100%] rounded-[30px] object-cover"
            alt="bg8"
          />
        </div>

        <div className="flex w-[50%] flex-col gap-4 px-[68px] pt-[80px]">
          <button className="h-[30px] w-[98px] flex-shrink-0 rounded-[20px] border border-white bg-[rgba(255,199,199,0.45)] font-inter text-[12px] font-medium leading-[110%] text-black backdrop-blur-[40px]">
            Startups
          </button>
          <div className="font-roboto relative text-[42px] font-bold leading-[110%] text-[#3D568F]">
            <span>
            Startup Founders
            </span>
            <div className="absolute top-[-15px] left-[210px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="46" height="23" viewBox="0 0 46 23" fill="none">
<path d="M41 23C41 18.2261 39.1036 13.6477 35.7279 10.2721C32.3523 6.89642 27.7739 5 23 5C18.2261 5 13.6477 6.89642 10.2721 10.2721C6.89642 13.6477 5 18.2261 5 23" stroke="#8B8DE1" strokeWidth="10"/>
</svg>
            </div>

          </div>
          <div className="font-inter text-[16px] font-normal leading-[125%] text-[#3D568F]">
            Customized mentorship for startup founders at any stage of their
            journey.
          </div>
          <div className="flex flex-col gap-2">
            <div className="mt-2 flex items-center gap-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="13"
                  viewBox="0 0 15 13"
                  fill="none"
                >
                  <path
                    d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                    fill="#0AC1A7"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
              <div className="font-inter text-[20px] font-normal leading-[100%] text-[#3D568F]">
              Market research insights
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="13"
                  viewBox="0 0 15 13"
                  fill="none"
                >
                  <path
                    d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                    fill="#0AC1A7"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
              <div className="font-inter text-[20px] font-normal leading-[100%] text-[#3D568F]">
              Pitch deck & Fundraising support
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="13"
                  viewBox="0 0 15 13"
                  fill="none"
                >
                  <path
                    d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                    fill="#0AC1A7"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
              <div className="font-inter text-[20px] font-normal leading-[100%] text-[#3D568F]">
              Scaling & growth strategies 
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="13"
                  viewBox="0 0 15 13"
                  fill="none"
                >
                  <path
                    d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                    fill="#0AC1A7"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
              <div className="font-inter text-[20px] font-normal leading-[100%] text-[#3D568F]">
              Presonalized solutions
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="13"
                  viewBox="0 0 15 13"
                  fill="none"
                >
                  <path
                    d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                    fill="#0AC1A7"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
              <div className="font-inter text-[20px] font-normal leading-[100%] text-[#3D568F]">
              Networking strategies
              </div>
            </div>
          </div>
          <button className="relative z-[40] mt-6 h-[45px] w-[183px] flex-shrink-0 rounded-[30px] bg-[#3D568F] font-inter text-[18px] font-medium leading-[110%] text-white">
            <Link href="/solutions/startup">Learn more</Link>
          </button>
        </div>
      </div>




      <div className="hidden lg:flex h-[564px] w-full flex-shrink-0 rounded-[30px] bg-[linear-gradient(0deg,#FFFDEB_0%,#FFFDEB_100%),conic-gradient(from_196deg_at_78.23%_63.56%,rgba(245,246,255,0)_0deg,rgba(197,192,216,0)_360deg)]">
        <div className="flex w-[50%] flex-col gap-4 px-[68px] pt-[60px]">
          <button className="w-[98px] h-[30px] flex-shrink-0 rounded-[20px] border border-white bg-[rgba(202,189,255,0.30)] backdrop-blur-[25px] text-black font-inter text-[12px] font-medium leading-[110%]">
          Mentors
          </button>
          <div className="font-roboto text-[42px] font-bold leading-[110%] text-[#3D568F]">
          Become a Mentor
          </div>
          <div className="font-inter text-[16px] font-normal leading-[125%] text-[#3D568F]">
          Share your expertise and make a difference in someone&apos;s career journey. Join our community of mentors.

          </div>
          <div className="flex flex-col gap-2">
            <div className="mt-2 flex items-center gap-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="13"
                  viewBox="0 0 15 13"
                  fill="none"
                >
                  <path
                    d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                    fill="#0AC1A7"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
              <div className="font-inter text-[20px] font-normal leading-[100%] text-[#3D568F]">
              Flexible scheduling 
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="13"
                  viewBox="0 0 15 13"
                  fill="none"
                >
                  <path
                    d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                    fill="#0AC1A7"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
              <div className="font-inter text-[20px] font-normal leading-[100%] text-[#3D568F]">
              Earn on your own terms
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="13"
                  viewBox="0 0 15 13"
                  fill="none"
                >
                  <path
                    d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                    fill="#0AC1A7"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
              <div className="font-inter text-[20px] font-normal leading-[100%] text-[#3D568F]">
              Expand your network
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="13"
                  viewBox="0 0 15 13"
                  fill="none"
                >
                  <path
                    d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                    fill="#0AC1A7"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
              <div className="font-inter text-[20px] font-normal leading-[100%] text-[#3D568F]">
              Guide future professional
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="13"
                  viewBox="0 0 15 13"
                  fill="none"
                >
                  <path
                    d="M5.50934 9.88456L13.4267 0.519427C13.7306 0.160154 14.2029 0.160248 14.5065 0.519368C14.8311 0.903426 14.8312 1.54097 14.5065 1.92543C14.5064 1.92545 14.5064 1.92547 14.5064 1.92549L5.45113 12.6367L0.559949 8.00854C0.207762 7.67517 0.141657 7.04286 0.433862 6.61124L0.433908 6.61117C0.710601 6.20217 1.18239 6.15325 1.50818 6.46185L1.50827 6.46194L5.1466 9.90474L5.33865 10.0865L5.50934 9.88456Z"
                    fill="#0AC1A7"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
              <div className="font-inter text-[20px] font-normal leading-[100%] text-[#3D568F]">
              Gain industry recognition
              </div>
            </div>
            
         
           
          </div>
          <button className="relative z-[40] mt-6 h-[45px] w-[183px] flex-shrink-0 rounded-[30px] bg-[#3D568F] font-inter text-[18px] font-medium leading-[110%] text-white">
            <Link href="/solutions/mentor">Learn more</Link>
          </button>
        </div>
        <div className="flex relative w-[50%] flex-col items-center justify-center">
          <img
            src="/bg10.png"
            className="relative z-[40] h-[100%] w-[100%] rounded-[30px] object-cover"
            alt="bg8"
          />
          <img src="/grad2.svg" className="absolute top-[30px] left-[-80px]" />
        </div>
      </div>
    </div>
  );
};

export default Solutions;
