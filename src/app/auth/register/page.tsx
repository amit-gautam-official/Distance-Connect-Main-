import RegisterForm from '@/components/auth/forms/register-form'

import { auth } from '@/server/auth';
import { db } from '@/server/db';
import { redirect } from 'next/navigation';
import React from 'react'

const RegisterPage = async () => {

  const session = await auth();
  // console.log("Session", session)
  if(session?.user) {
    const dbUser = await db.user.findUnique({
            where: {
                id  : session?.user?.id,
            }
        }); 

    if (dbUser?.isRegistered) {
      // Redirect based on user role
      if (dbUser?.role === "MENTOR") {
        return redirect("/mentor-dashboard")
      } else if (dbUser?.role === "STUDENT") {
        return redirect("/student-dashboard")
      }
    } else {
      return redirect("/auth/login")
    }
  }


  return (
    <RegisterForm />
  )
}

export default RegisterPage