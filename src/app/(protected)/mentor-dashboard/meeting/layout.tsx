import React from 'react'
import SideNavBar from './_components/SideNavbar'
import { Toaster } from '@/components/ui/sonner'

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