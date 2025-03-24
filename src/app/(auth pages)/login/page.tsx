"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="relative flex h-screen flex-col overflow-x-hidden md:justify-center xl:min-h-screen xl:flex-row xl:justify-start">
      <img src="/signin/bg.svg" className="absolute z-10" />

      {/* Left Section */}
      <div className="relative z-20 flex w-full flex-col h-screen overflow-y-scroll no-scrollbar justify-between p-8 xl:w-[55%]">
        <div className="mb-8 items-center justify-start md:flex xl:flex">
          <div className="m-auto w-[300px] bg-gradient-to-r from-[#496F74] via-[#6E9195] to-[#2D4F61] bg-clip-text text-center font-inter text-2xl font-bold leading-[24px] text-transparent md:text-2xl xl:m-0">
            Distance Connect
          </div>
          
        </div>

        <div className="mx-auto w-full max-w-md">
          <h1 className="mb-12 text-[#171923] font-inter text-[48px] font-bold leading-[48px]">
            Sign in
          </h1>
          <div className=" text-[#718096] font-inter text-[18px] font-normal leading-[27px] mb-12">
          Don’t have an account?{" "}
              <Link href="/login" className="text-[#2D56B1] font-inter text-[18px] font-medium leading-[150%] underline decoration-solid decoration-0 underline-offset-auto">
                Create Now
              </Link>
            </div>

          <form className="space-y-6">
         

            <div className="space-y-2 text-[#828282]">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="yourname@email.com" />
            </div>

            

            <div className="space-y-2 text-[#828282]">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
              <div className="flex justify-between items-center space-x-2">
              <div className="flex items-center gap-2">
              <Checkbox className="w-3 h-3" id="terms" />
             <span className="text-[#A1A1A1]  font-nunito-sans text-[12px] font-normal leading-normal">
              Remember Me</span>
              </div>
              <span className="text-[#2E56B1] font-nunito-sans text-[12px] font-semibold leading-normal underline decoration-solid decoration-0 underline-offset-auto">Forgot Password?</span>
            </div>
            </div>

            

            <button
              type="submit"
              className="h-[40px] w-full rounded-md bg-black font-bold text-white"
            >
              Login
            </button>
            <button
              type="submit"
              className="h-[40px] w-full rounded-md bg-black font-bold text-white"
            >
              Continue with Phone
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#A0AEC0]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-[#718096]">or</span>
              </div>
            </div>

           

<div className="grid gap-2">
              <Button variant="outline" className="w-full flex justify-between" size="lg">
                <Image
                  src="/signin/google.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                <span className="text-[#67728A] font-inter text-[18px] font-medium leading-[28px]">Continue with Google</span>
                <div></div>
              </Button>
              <Button variant="outline" className="w-full flex justify-between" size="lg">
              <img
                  src="/signin/linkedin.png"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                <span className="text-[#67728A] font-inter text-[18px] font-medium leading-[28px]">Continue with Linkedin</span>
                <div></div>
              </Button>
              <Button variant="outline" className="w-full flex justify-between" size="lg">
              <Image
                  src="/signin/github.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                <span className="text-[#67728A] font-inter text-[18px] font-medium leading-[28px]">Continue with Github</span>
                <div></div>
              </Button>
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
