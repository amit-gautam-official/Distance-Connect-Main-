import { Button } from '@/components/ui/button'
import { api } from '@/trpc/server';
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation';
import React from 'react'

async function Confirmation() {
     try{
       const user = await api.user.getMe();
       if (!user || user.role !== "STUDENT") {
         redirect("/register");
       }
   
     }catch(err){
      redirect("/auth/login");
     }

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