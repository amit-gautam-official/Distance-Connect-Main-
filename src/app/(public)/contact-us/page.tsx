"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactForm() {
  return (
   <div className="relative">
     <div className="mx-auto hidden lg:flex xl:pt-[150px] flex-col justify-center w-[80%] max-w-6x min-h-[calc(100vh-450px)] px-4 py-12">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Contact Form */}
        <div className="rounded-3xl bg-[#EEF3FF] p-6 md:p-8">
          <form className="space-y-4">
            <Input
              type="text"
              placeholder="John"
              className="border-0 bg-white placeholder:text-muted-foreground"
            />
            <Input
              type="email"
              placeholder="example@email.com"
              className="border-0 bg-white placeholder:text-muted-foreground"
            />
            <Input
              type="tel"
              placeholder="(123) 456 - 789"
              className="border-0 bg-white placeholder:text-muted-foreground"
            />
            <Textarea
              placeholder="Please type your message here..."
              className="min-h-[120px] border-0 bg-white placeholder:text-muted-foreground"
            />
            <Button className="w-full bg-[#3B5998] text-white hover:bg-[#3B5998]/90">
              Send message
            </Button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-6 lg:px-6">
          <div className="space-y-2">
            <p className="text-[var(--Neutral-Colors-Color-900,#8D8BA7)] font-inter text-[18px] font-bold leading-[20px] tracking-[1.8px] uppercase">CONTACT US</p>
            <h2 className="text-[#3D568F] font-inter text-[44px] font-bold leading-[50px] ">
              Get in touch today
            </h2>
            <p className="text-[var(--Neutral-Colors-Text-Gray,#9795B5)] font-inter text-[18px] font-normal leading-[30px]">
              Lorem ipsum dolor sit amet consectetur adipiscing elit nulla adipiscing tincidunt interdum tellus du.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 text-center text-[18px] font-inter font-normal leading-[18px] text-[var(--Neutral-Colors-Color-900,#8D8BA7)]">
              <Mail className="h-5 w-5" />
              <span>contact@company.com</span>
            </div>
            <div className="flex items-center gap-3 text-center text-[18px] font-inter font-normal leading-[18px] text-[var(--Neutral-Colors-Color-900,#8D8BA7)]">
              <Phone className="h-5 w-5" />
              <span>(123) 456 - 789</span>
            </div>
            <div className="flex items-center gap-3 text-center text-[18px] font-inter font-normal leading-[18px] text-[var(--Neutral-Colors-Color-900,#8D8BA7)]">
              <MapPin className="h-5 w-5" />
              <span>794 Dtu Delhi, 94102</span>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="mt-16 grid gap-4 lg:grid-cols-2 lg:items-center">
        <div>
          <h3 className="text-[#0A0A0A] font-inter text-[30px] font-normal leading-[38px]">Join 2,000+ subscribers</h3>
          <p className="text-muted-foreground">
            Stay in the loop with everything you need to know.
          </p>
        </div>
        <div className="flex gap-2">
          <div>
          <Input
            type="email"
            placeholder="Enter your email"
            className="flex items-center gap-2 self-stretch rounded-[48px] border border-[var(--Gray-300,#D0D5DD)] bg-[#3D568F] px-4 py-3 shadow-xs text-white font-inter text-[16px] font-normal leading-6"
          />
          <p className="text-[#0A0A0A] font-inter text-[14px] font-normal leading-5">We care about your data in our 
          <a href="#" className="underline">
          privacy policy
        </a>
          </p>
          </div>
          <Button className="flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-[#EDFB90] bg-[#EDFB90] shadow-xs text-[#3D568F] font-inter text-[16px] font-semibold leading-6">
            Subscribe
          </Button>

        </div>
      </div>
     
    </div>

    <div className="lg:hidden min-h-[100vh]">
      <div>
        <img src="/img.jpg" alt="contactus" className="w-full h-full  top-0 left-0 rotate-180 object-cover" />
        {/* Contact Form */}
        <div className="grid gap-8  w-[335px]  md:w-[500px] mx-auto mt-[-200px] relative z-10 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 md:p-8">
          <form className="space-y-4">
            <Input
              type="text"
              placeholder="John"
              className="border-0 bg-[#EEF3FF] placeholder:text-muted-foreground"
            />
            <Input
              type="email"
              placeholder="example@email.com"
              className="border-0 bg-[#EEF3FF] placeholder:text-muted-foreground"
            />
            <Input
              type="tel"
              placeholder="(123) 456 - 789"
              className="border-0 bg-[#EEF3FF] placeholder:text-muted-foreground"
            />
            <Textarea
              placeholder="Please type your message here..."
              className="min-h-[120px] border-0 bg-[#EEF3FF] placeholder:text-muted-foreground"
            />
            <Button className="w-full bg-[#3B5998] text-white hover:bg-[#3B5998]/90">
              Send message
            </Button>
          </form>
        </div>

      </div>
    <div className=" w-full mt-[-100px]  h-[506px] flex-shrink-0 bg-[#9FBAF1]">
      <div className="flex flex-col text-center pt-[150px]">
        <div className="text-white text-center font-[DM Sans] text-[22px] font-bold leading-[28px]">
          Visit Us
        </div>
        <div className="text-white text-center font-[DM Sans] text-[18px] font-normal leading-[30px]">
        58 rohini Rd <br/>
        Delhi, 110042
        </div>
      </div>
      <div className="flex flex-col text-center pt-[60px]">
        <div className="text-white text-center font-[DM Sans] text-[22px] font-bold leading-[28px]">
        Contact Us
        </div>
        <div className="text-white text-center font-[DM Sans] text-[18px] font-normal leading-[30px]">
        (123) 456 - 789 <br/>
        (123) 456 - 789 <br/>
        contact@company.com
        </div>
      </div>
    </div>
      </div>


    </div>
   </div>
  )
}
