"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BriefcaseBusiness, Github, Linkedin, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import MentorForm from "./MentorForm";
import StudentForm from "./StudentForm";
import StartupForm from "./StartupForm";

import {SessionUserSchema} from "@/schemas";

import { z } from "zod";



export default function RegisterForm({
  user,
}: {
  user: z.infer<typeof SessionUserSchema>;
}) {
  const [role, setRole] = useState<string>("");
  const [step, setStep] = useState<number>(1);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden md:items-center md:justify-center xl:flex-row xl:items-stretch xl:justify-start">
      {/* <img src="/signin/bg.svg" className="absolute z-10" /> */}

      {/* Left Section */}
      <div className="no-scrollbar relative z-20 flex min-h-screen w-full flex-col justify-between overflow-y-auto p-4 sm:p-6 md:p-8 xl:w-[55%]">
        <div className="mb-6 flex items-center justify-center md:mb-8 md:justify-between">
          {/* <div className="w-[200px] bg-gradient-to-r from-[#496F74] via-[#6E9195] to-[#2D4F61] bg-clip-text text-center font-inter text-xl font-bold leading-[24px] text-transparent sm:w-[250px] sm:text-2xl md:w-[300px] xl:text-left">
            Distance Connect
          </div> */}
          <img src="/logo.png" className=" w-auto h-[80px]" alt="Logo" />
        </div>

        {step === 1 ? (
          <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center font-inter text-[15px] font-normal leading-[16px] text-black xl:text-[20px]">
            <h1 className="mb-6 flex text-center font-medium font-inter text-xl  leading-normal text-black sm:text-2xl md:mb-8 xl:mb-12 xl:text-[32px]">
              <div>How would you like to get started?</div>
            </h1>
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:gap-x-16 xl:gap-y-10">
              {/* <button
                onClick={() => {
                  setRole("STARTUP");
                  setStep(2);
                }}
                className="h-[45px] w-full flex-shrink-0 rounded-[8px] border border-[#8A8A8A] shadow-[0px_2px_2px_2px_rgba(204,204,204,0.1)] transition-colors hover:border-blue-400 hover:text-[#0A64BC] focus:border-blue-400 focus:text-[#0A64BC] xl:h-[65.66px]"
              >
                To Hire
              </button> */}
              <button
                onClick={() => {
                  setRole("MENTOR");
                  setStep(2);
                }}
                className="h-[45px] w-full flex-shrink-0 rounded-[8px] border border-[#8A8A8A] shadow-[0px_2px_2px_2px_rgba(204,204,204,0.1)] transition-colors hover:border-blue-400 hover:text-[#0A64BC] focus:border-blue-400 focus:text-[#0A64BC] xl:h-[65.66px] m-auto flex justify-center items-center gap-2 "
              >
                <BriefcaseBusiness className="h-4 w-4" />
                To be a Mentor
              </button>
              <button
                onClick={() => {
                  setRole("STUDENT");
                  setStep(2);
                }}
                className="h-[45px] w-full  justify-center items-center flex-shrink-0 rounded-[8px] border border-[#8A8A8A] shadow-[0px_2px_2px_2px_rgba(204,204,204,0.1)] transition-colors flex hover:border-blue-400 hover:text-[#0A64BC] focus:border-blue-400 focus:text-[#0A64BC] xl:h-[65.66px]"
              >
                <User className="mr-2 h-6 w-6" />
                Placement Preparation
              </button>
              {/* <button
                onClick={() => {
                  setRole("STUDENT");
                  setStep(2);
                }}
                className="h-[45px] w-full flex-shrink-0 rounded-[8px] border border-[#8A8A8A] shadow-[0px_2px_2px_2px_rgba(204,204,204,0.1)] transition-colors hover:border-blue-400 hover:text-[#0A64BC] focus:border-blue-400 focus:text-[#0A64BC] xl:h-[65.66px]"
              >
                Find Jobs
              </button> */}
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-2xl flex-grow">
            {role === "MENTOR" && <MentorForm user={user} />}
            {role === "STUDENT" && <StudentForm user={user} />}
            {/* {role === "STARTUP" && <StartupForm user={user} />} */}
          </div>
        )}
        <div>
          <div
            className={`mt-6 flex w-full items-center md:mt-8 ${step === 1 ? "justify-end" : "justify-start"}`}
          >
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="font-inter text-[16px] font-normal leading-[24px] text-[#4D7CD6] underline decoration-solid decoration-0 underline-offset-auto transition-colors hover:text-[#3A67B9] md:text-[20px] lg:text-[22px]"
              >
                {"<"} Back
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Section - Only show on desktop/large tablets */}
      <div className="relative hidden bg-[#0A64BC] lg:flex md:min-h-screen md:w-full md:items-center md:justify-center xl:w-[45%]">
        <div className="absolute left-0 right-0 top-0 p-8">
          <Link href={"/contact-us"} className="flex items-center gap-4">
            <img src="/support.svg" className="cursor-pointer" alt="Support" />
            <span className="text-lg font-medium text-[#F7FAFC] mt-[2px]">Contact Us</span>
          </Link>
        </div>
        <img
          className="absolute right-0 top-[-70px] h-auto w-full max-w-[350px] xl:max-w-[450px]"
          alt="Decorative Image 1"
          src="/signin/image1.svg"
        />
        <img
          className="absolute bottom-[60px] right-[-70px] h-auto w-full max-w-[300px] scale-x-[-1] xl:max-w-[400px]"
          alt="Decorative Image 2"
          src="/signin/image3.png"
        />
        <div className="absolute right-[80px] top-[160px] text-right font-inter text-xl font-semibold leading-normal text-white md:text-[24px]">
          The largest community of
          <br /> Mentors and Startups
        </div>
      </div>
      <img
        className="absolute bottom-0 left-[47.5%] hidden h-auto w-full max-w-[400px] scale-x-[-1] xl:block"
        alt="Decorative Image 3"
        src="/signin/image2.png"
      />
    </div>
  );
}
