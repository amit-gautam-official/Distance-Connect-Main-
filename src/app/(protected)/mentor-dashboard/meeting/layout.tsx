import React from 'react'
import SideNavBar from './_components/SideNavbar'
import { Toaster } from '@/components/ui/sonner'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Distance Connect",
  description: "A platform for connecting students and mentors.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

function MeetingLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
        <div className='hidden md:block md:w-64 bg-slate-50 h-screen fixed'>
            <SideNavBar/>
        </div>
        <div className='md:ml-64'>
            <Toaster />
        {children}
        </div>
    </div>
  )
}

export default MeetingLayout