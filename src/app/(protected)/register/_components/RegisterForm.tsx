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
import { Github, Linkedin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import MentorForm from "./MentorForm";
import StudentForm from "./StudentForm";
import StartupForm from "./StartupForm";

export default function RegisterForm({
  user,
}: {
  user: { firstName: string; lastName: string; id: string };
}) {
  const [role, setRole] = useState<string>("");
  const [step, setStep] = useState<number>(1);

  return (
    <div className="relative flex h-screen flex-col overflow-x-hidden md:justify-center xl:min-h-screen xl:flex-row xl:justify-start">
      {/* <img src="/signin/bg.svg" className="absolute z-10" /> */}

      {/* Left Section */}
      <div className="no-scrollbar relative z-20 flex h-screen w-full flex-col justify-between overflow-y-scroll p-8 xl:w-[55%]">
        <div className="mb-8 items-center justify-between md:flex xl:flex">
          <div className="m-auto w-[300px] bg-gradient-to-r from-[#496F74] via-[#6E9195] to-[#2D4F61] bg-clip-text text-center font-inter text-2xl font-bold leading-[24px] text-transparent md:text-2xl xl:m-0">
            Distance Connect
          </div>
        </div>

        {step === 1 ? (
          <div className="mx-auto flex w-full flex-col items-center justify-center font-inter text-[15px] font-normal leading-[16px] text-[#8A8A8A] xl:text-[20px]">
            <h1 className="justify- flex font-inter text-[22px] font-normal leading-[36px] text-black xl:mb-12 xl:text-[32px]">
              <div>How would you like to get started?</div>
            </h1>
            <div className="mt-4 flex flex-wrap gap-y-6 xl:grid xl:grid-cols-2 xl:gap-x-16 xl:gap-y-10">
              <button
                onClick={() => {
                  setRole("STARTUP");
                  setStep(2);
                }}
                className="h-[40px] w-[104px] flex-shrink-0 rounded-[8px] border border-[#8A8A8A] shadow-[0px_2px_2px_2px_rgba(204,204,204,0.1)] focus:border-blue-400 focus:text-[#0A64BC] xl:h-[65.66px] xl:w-[233.003px]"
              >
                To Hire
              </button>
              <button
                onClick={() => {
                  setRole("MENTOR");
                  setStep(2);
                }}
                className="ml-10 h-[40px] w-[153px] flex-shrink-0 rounded-[8px] border border-[#8A8A8A] shadow-[0px_2px_2px_2px_rgba(204,204,204,0.1)] focus:border-blue-400 focus:text-[#0A64BC] xl:ml-0 xl:h-[65.66px] xl:w-[233.003px]"
              >
                To be a Mentor
              </button>
              <button
                onClick={() => {
                  setRole("STUDENT");
                  setStep(2);
                }}
                className="h-[40px] w-[188px] flex-shrink-0 rounded-[8px] border border-[#8A8A8A] shadow-[0px_2px_2px_2px_rgba(204,204,204,0.1)] focus:border-blue-400 focus:text-[#0A64BC] xl:h-[65.66px] xl:w-[233.003px]"
              >
                Placement Preparation
              </button>
              <button
                onClick={() => {
                  setRole("STUDENT");
                  setStep(2);
                }}
                className="ml-10 h-[40px] w-[94px] flex-shrink-0 rounded-[8px] border border-[#8A8A8A] shadow-[0px_2px_2px_2px_rgba(204,204,204,0.1)] focus:border-blue-400 focus:text-[#0A64BC] xl:ml-0 xl:h-[65.66px] xl:w-[233.003px]"
              >
                Find Jobs
              </button>
            </div>
          </div>
        ) : (
          <div>
            {role === "MENTOR" && <MentorForm user={user} />}
            {role === "STUDENT" && <StudentForm user={user} />}
            {role === "STARTUP" && <StartupForm user={user} />}
          </div>
        )}
        <div>
          <div
            className={`mt-8 flex w-full items-center ${step === 1 ? "justify-end" : "justify-start"}`}
          >
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="font-inter text-[16px] font-normal leading-[24px] text-[#4D7CD6] underline decoration-solid decoration-0 underline-offset-auto md:text-[20px] lg:text-[26px]"
              >
                {"<"} Back
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="relative hidden items-center justify-center overflow-hidden bg-[#0A64BC] xl:flex xl:w-[45%]">
        <div className="absolute left-0 right-0 top-0 p-8">
          <div className="flex items-center gap-4">
            <img src="/support.svg" className="cursor-pointer" alt="Support" />
            <span className="text-lg font-medium text-[#F7FAFC]">Support</span>
          </div>
        </div>
        <img
          className="absolute right-0 top-[-70px]"
          alt="Decorative Image 1"
          src="/signin/image1.svg"
          width={450}
          height={450}
        />
        <img
          className="absolute bottom-[60px] right-[-70px] scale-x-[-1]"
          alt="Decorative Image 2"
          src="/signin/image3.png"
          width={400}
          height={400}
        />
        <div className="absolute right-[80px] top-[160px] text-right font-inter text-[24px] font-semibold leading-normal text-white">
          The largest community of
          <br /> Mentors and Startups
        </div>
      </div>
      <img
        className="absolute bottom-0 left-[47.5%] hidden scale-x-[-1] xl:block"
        alt="Decorative Image 3"
        src="/signin/image2.png"
        width={500}
        height={500}
      />
    </div>
  );
}
