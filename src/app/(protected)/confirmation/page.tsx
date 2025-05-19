"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button'
import { api } from '@/trpc/react';
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function Confirmation() {

    const router = useRouter();
    
    const user =  api.user.getMe.useQuery();
  
    useEffect(() => {
      if (user.isError) {
        router.push("/auth/login");
      } else if (user.data && user.data.role !== "STUDENT") {
        router.push("/register");
      }
    }
    , [user.isError, user.data, router]);

  return (
    <div className='flex flex-col items-center justify-center gap-6
    p-20'>
        <CheckCircle className='h-9 w-9 text-green-500'/>
        <h2 className='font-bold text-3xl'>Your meeting scheduled successfully!</h2>
        <h2 className='text-lg text-gray-500'>Confirmation sent on your email</h2>
        <Link href={'/student-dashboard'}><Button>
            Go to Dashboard
          </Button></Link> 

    </div>
  )
}

export default Confirmation