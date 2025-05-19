// pages/index.js
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Send } from "lucide-react";
import Head from "next/head";
import Link from "next/link";

export default function PricingPage() {
  return (
    <>
      <Head>
        <title>Pricing For Mentors | 1% Commission</title>
        <meta name="description" content="We charge only 1% commission - even less than your daily coffee tip. Get paid by direct clients worldwide." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-gray-100 rounded-full opacity-30"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-pink-100 rounded-full opacity-30"></div>
        <div className="absolute top-1/3 right-10 rotate-12 hidden sm:block">
          <div className="w-12 h-12 bg-yellow-300 rounded-sm relative">
            <div className="absolute inset-0 bg-teal-400 rounded-sm -rotate-45 transform origin-center"></div>
          </div>
        </div>

        <main className="w-full max-w-3xl mx-auto relative z-10">
          {/* Main Content */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-blue-400 font-medium mb-2 md:mb-4 text-xs sm:text-sm tracking-wide uppercase">PRICING FOR MENTORS</h2>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">We Charge Only 1% Commission</h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-2 md:mb-4">Even less than your daily coffee tip</p>
            <p className="text-sm md:text-base text-gray-500 mb-4 md:mb-6">Get paid by direct clients worldwide</p>
            
            <div className="flex justify-center mb-8 md:mb-16">
             <Link href="/auth/login?screen_hint=signup">
             <Button className="bg-blue-300 hover:bg-blue-400 text-blue-800 px-6 sm:px-8 py-1.5 sm:py-2 rounded-full text-sm sm:text-base">
                Lets go
              </Button>
              </Link>
            </div>
          </div>

          {/* Transaction cards with connecting dotted line */}
          <div className="relative flex flex-col sm:flex-row justify-between gap-8 sm:gap-0 mx-4 md:mx-0">
            {/* Connecting dotted line - hidden on mobile, visible on tablet/desktop */}
            <div className="absolute top-1/2 left-20 right-20 border-t-2 border-dashed border-gray-200 z-0 hidden sm:block">
              <div className="absolute top-0 left-1/4 w-2 h-2 bg-gray-200 rounded-full -mt-1"></div>
              <div className="absolute top-0 right-1/4 w-2 h-2 bg-gray-200 rounded-full -mt-1"></div>
            </div>
            
            {/* First transaction card */}
            <div className="relative z-10 bg-white rounded-lg shadow-md p-4 max-w-xs w-full mx-auto sm:mx-0">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                  <img src="/smallLogo.png" alt="DC" className="w-full h-full object-cover object-top" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Distance Connect</p>
                  <p className="text-xs text-gray-500">India</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-xs text-gray-500">Total amount</p>
                <p className="text-2xl font-bold">₹500</p>
              </div>
              <div className="w-full bg-orange-50 text-orange-500 border border-orange-100 py-2 px-4 rounded-md flex items-center justify-center gap-2 text-sm">
                <Send size={14} /> Send request
              </div>
            </div>
            
            {/* Second transaction card */}
            <div className="relative z-10 bg-white rounded-lg shadow-md p-4 max-w-xs w-full mx-auto sm:mx-0">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                  <img src="/mentors/m2.jpeg" alt="William Johnson" className="w-full h-full object-cover object-top" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">William Johnson</p>
                  <p className="text-xs text-gray-500">Mar 2nd 2021</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-2xl font-bold">₹495</p>
              </div>
              <div className="w-full bg-green-50 text-green-600 py-2 px-4 rounded-md flex items-center justify-center gap-2 text-sm">
                <CheckCircle size={14} /> Received
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}