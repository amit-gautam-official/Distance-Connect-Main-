'use client';

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
import { Github, Linkedin } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="h-screen xl:min-h-screen flex flex-col xl:justify-start md:justify-center  xl:flex-row overflow-x-hidden relative">
      <img src="/signin/bg.svg" className="absolute z-10" />

      {/* Left Section */}
      <div className="w-full xl:w-[55%] overflow-y-scroll no-scrollbar p-8 flex flex-col  justify-between relative z-20">
        <div className="md:flex xl:flex  justify-start items-center mb-8">
          <div className="bg-gradient-to-r xl:m-0 m-auto w-[300px] text-center from-[#496F74] via-[#6E9195] to-[#2D4F61] bg-clip-text text-transparent font-inter text-2xl md:text-2xl font-bold leading-[24px]">
            Distance Connect
          </div>
        
        </div>

        <div className="max-w-md mx-auto w-full">
          <h1 className="text-black font-inter text-[32px] font-bold leading-[36px] mb-8">
            Let&apos;s get you started
          </h1>

          <form className="space-y-6">
            <div className="space-y-2 text-[#828282]">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" placeholder="Ade Tiger" />
            </div>

            <div className="space-y-2 text-[#828282]">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" placeholder="yourname@email.com" />
            </div>


            <div className="space-y-2 text-[#828282]">
              <Label htmlFor="password">Create password</Label>
              <Input id="password" type="password" />
              <p className="text-xs text-gray-500">
                Password must contain a minimum of 8 characters
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label htmlFor="terms" className="text-[#8C8585]">
                I agree to the{" "}
                <Link href="#" className="text-blue-600">
                  User Agreement
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-blue-600">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="text-white font-bold w-full rounded-md bg-black h-[40px]"
            >
              Sign Up
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#A0AEC0]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="text-[#718096] bg-white px-2">or</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <div className="flex w-[48px] h-[48px] items-center justify-center rounded-full bg-[#E4EBF5] shadow">
                <Linkedin className="w-5 h-5" />
              </div>
              <div className="flex w-[48px] h-[48px] items-center justify-center rounded-full bg-[#E4EBF5] shadow">
                <Github className="w-5 h-5" />
              </div>
              <div className="flex w-[48px] h-[48px] items-center justify-center rounded-full bg-[#E4EBF5] shadow">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
  <path d="M13.8601 7.15936C13.8601 6.66299 13.8156 6.18572 13.7329 5.72754H7.14014V8.43526H10.9074C10.7451 9.31026 10.252 10.0516 9.51059 10.548V12.3043H11.7729C13.0965 11.0857 13.8601 9.29117 13.8601 7.15936Z" fill="#121212"/>
  <path d="M7.14021 14.0001C9.03021 14.0001 10.6148 13.3733 11.7729 12.3042L9.51066 10.5478C8.88385 10.9678 8.08203 11.216 7.14021 11.216C5.31703 11.216 3.77385 9.98462 3.2234 8.33008H0.884766V10.1437C2.03658 12.4314 4.40385 14.0001 7.14021 14.0001Z" fill="#121212"/>
  <path d="M3.22332 8.33008C3.08332 7.91008 3.00377 7.46144 3.00377 7.00008C3.00377 6.53871 3.08332 6.09008 3.22332 5.67008V3.85645H0.884682C0.394682 4.8319 0.139705 5.90847 0.140137 7.00008C0.140137 8.12962 0.410592 9.19871 0.884682 10.1437L3.22332 8.33008Z" fill="#121212"/>
  <path d="M7.14021 2.78409C8.16794 2.78409 9.09066 3.13727 9.81612 3.8309L11.8238 1.82318C10.6116 0.693636 9.02703 0 7.14021 0C4.40385 0 2.03658 1.56863 0.884766 3.85636L3.2234 5.66999C3.77385 4.01545 5.31703 2.78409 7.14021 2.78409Z" fill="#121212"/>
</svg>
              </div>

            </div>

            <div className="text-center text-[#C4C4C4]">
              Already a user?{" "}
              <Link href="/login" className="text-[#476D73] underline">
                Login
              </Link>
            </div>
          </form>
        </div>
        <div></div>
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
